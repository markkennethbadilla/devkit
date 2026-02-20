"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// Simple JSON to YAML converter (no dependencies)
function jsonToYaml(obj: unknown, indent: number = 0): string {
  const pad = "  ".repeat(indent);

  if (obj === null) return "null";
  if (obj === undefined) return "null";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    // Quote strings that need it
    if (
      obj === "" ||
      obj.includes(":") ||
      obj.includes("#") ||
      obj.includes("\n") ||
      obj.includes("'") ||
      obj.includes('"') ||
      obj.startsWith(" ") ||
      obj.endsWith(" ") ||
      obj === "true" ||
      obj === "false" ||
      obj === "null" ||
      obj === "yes" ||
      obj === "no" ||
      /^\d/.test(obj)
    ) {
      return JSON.stringify(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    const lines: string[] = [];
    for (const item of obj) {
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        const entries = Object.entries(item as Record<string, unknown>);
        if (entries.length > 0) {
          const [firstKey, firstVal] = entries[0];
          lines.push(`${pad}- ${firstKey}: ${jsonToYaml(firstVal, indent + 2)}`);
          for (let i = 1; i < entries.length; i++) {
            const [k, v] = entries[i];
            lines.push(`${pad}  ${k}: ${jsonToYaml(v, indent + 2)}`);
          }
        } else {
          lines.push(`${pad}- {}`);
        }
      } else {
        lines.push(`${pad}- ${jsonToYaml(item, indent + 1)}`);
      }
    }
    return "\n" + lines.join("\n");
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines: string[] = [];
    for (const [key, value] of entries) {
      const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : JSON.stringify(key);
      const yamlValue = jsonToYaml(value, indent + 1);
      if (typeof value === "object" && value !== null && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
        lines.push(`${pad}${safeKey}:${yamlValue}`);
      } else {
        lines.push(`${pad}${safeKey}: ${yamlValue}`);
      }
    }
    return (indent > 0 ? "\n" : "") + lines.join("\n");
  }

  return String(obj);
}

// Simple YAML to JSON parser (handles common cases)
function yamlToJson(yaml: string): unknown {
  const lines = yaml.split("\n");
  return parseYamlLines(lines, 0, 0).value;
}

function parseYamlLines(
  lines: string[],
  startIdx: number,
  baseIndent: number
): { value: unknown; nextIdx: number } {
  if (startIdx >= lines.length) return { value: null, nextIdx: startIdx };

  const line = lines[startIdx];
  const trimmed = line.trimStart();
  const indent = line.length - trimmed.length;

  // Skip empty and comment lines
  if (trimmed === "" || trimmed.startsWith("#")) {
    return parseYamlLines(lines, startIdx + 1, baseIndent);
  }

  // Array item
  if (trimmed.startsWith("- ")) {
    const arr: unknown[] = [];
    let idx = startIdx;
    while (idx < lines.length) {
      const l = lines[idx];
      const t = l.trimStart();
      const i = l.length - t.length;
      if (t === "" || t.startsWith("#")) { idx++; continue; }
      if (i < indent) break;
      if (i === indent && t.startsWith("- ")) {
        const rest = t.slice(2);
        if (rest.includes(": ")) {
          // Inline object in array
          const obj: Record<string, unknown> = {};
          const [key, ...valParts] = rest.split(": ");
          obj[key.trim()] = parseScalar(valParts.join(": "));
          idx++;
          // Check for continuation lines
          while (idx < lines.length) {
            const nl = lines[idx];
            const nt = nl.trimStart();
            const ni = nl.length - nt.length;
            if (nt === "" || nt.startsWith("#")) { idx++; continue; }
            if (ni <= indent) break;
            if (nt.includes(": ")) {
              const [k2, ...v2] = nt.split(": ");
              obj[k2.trim()] = parseScalar(v2.join(": "));
              idx++;
            } else {
              break;
            }
          }
          arr.push(obj);
        } else {
          arr.push(parseScalar(rest));
          idx++;
        }
      } else {
        break;
      }
    }
    return { value: arr, nextIdx: idx };
  }

  // Object
  if (trimmed.includes(": ") || trimmed.endsWith(":")) {
    const obj: Record<string, unknown> = {};
    let idx = startIdx;
    while (idx < lines.length) {
      const l = lines[idx];
      const t = l.trimStart();
      const i = l.length - t.length;
      if (t === "" || t.startsWith("#")) { idx++; continue; }
      if (i < indent) break;
      if (i > indent) break;

      if (t.endsWith(":")) {
        const key = t.slice(0, -1).trim().replace(/^["']|["']$/g, "");
        idx++;
        const result = parseYamlLines(lines, idx, i + 2);
        obj[key] = result.value;
        idx = result.nextIdx;
      } else if (t.includes(": ")) {
        const colonIdx = t.indexOf(": ");
        const key = t.slice(0, colonIdx).trim().replace(/^["']|["']$/g, "");
        const val = t.slice(colonIdx + 2);
        obj[key] = parseScalar(val);
        idx++;
      } else {
        break;
      }
    }
    return { value: obj, nextIdx: idx };
  }

  return { value: parseScalar(trimmed), nextIdx: startIdx + 1 };
}

function parseScalar(s: string): unknown {
  const t = s.trim();
  if (t === "null" || t === "~") return null;
  if (t === "true" || t === "yes") return true;
  if (t === "false" || t === "no") return false;
  if (t === "[]") return [];
  if (t === "{}") return {};
  if (/^-?\d+$/.test(t)) return parseInt(t, 10);
  if (/^-?\d+\.\d+$/.test(t)) return parseFloat(t);
  // Remove quotes
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

const SAMPLE_JSON = `{
  "name": "DevKit",
  "version": "1.0.0",
  "description": "Developer tools collection",
  "features": ["JSON Formatter", "Base64 Encoder", "Color Converter"],
  "config": {
    "port": 3000,
    "debug": false,
    "database": {
      "host": "localhost",
      "name": "devkit_db"
    }
  }
}`;

export default function JsonToYamlPage() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [direction, setDirection] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const { copy, Toast } = useCopyToast();

  const output = useMemo(() => {
    const input = jsonInput.trim();
    if (!input) return "";
    try {
      if (direction === "json-to-yaml") {
        const parsed = JSON.parse(input);
        return jsonToYaml(parsed);
      } else {
        const parsed = yamlToJson(input);
        return JSON.stringify(parsed, null, 2);
      }
    } catch (e) {
      return `Error: ${(e as Error).message}`;
    }
  }, [jsonInput, direction]);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        JSON to YAML Converter
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Convert between JSON and YAML formats instantly.
      </p>

      {/* Direction toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
        <button
          className={direction === "json-to-yaml" ? "btn" : "btn-secondary"}
          onClick={() => setDirection("json-to-yaml")}
        >
          JSON → YAML
        </button>
        <button
          className={direction === "yaml-to-json" ? "btn" : "btn-secondary"}
          onClick={() => setDirection("yaml-to-json")}
        >
          YAML → JSON
        </button>
        <button className="btn-secondary" onClick={() => copy(output)} style={{ marginLeft: "auto" }}>
          Copy Output
        </button>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>
            {direction === "json-to-yaml" ? "JSON Input" : "YAML Input"}
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
            placeholder={direction === "json-to-yaml" ? "Paste JSON..." : "Paste YAML..."}
            style={{
              width: "100%",
              minHeight: 400,
              fontFamily: "monospace",
              fontSize: "0.82rem",
              padding: "0.8rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              resize: "vertical",
              lineHeight: 1.5,
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>
            {direction === "json-to-yaml" ? "YAML Output" : "JSON Output"}
          </div>
          <pre
            style={{
              minHeight: 400,
              padding: "0.8rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: output.startsWith("Error:") ? "#ef4444" : "var(--foreground)",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              overflow: "auto",
              margin: 0,
            }}
          >
            {output || "Output will appear here"}
          </pre>
        </div>
      </div>

      <Toast />
    </main>
  );
}
