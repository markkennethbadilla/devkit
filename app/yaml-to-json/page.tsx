"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// Lightweight YAML parser for common cases (no external dependency)
function parseYaml(yaml: string): unknown {
  const lines = yaml.split(/\r?\n/);
  return parseBlock(lines, 0, 0).value;
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function parseBlock(
  lines: string[],
  start: number,
  baseIndent: number
): { value: unknown; nextLine: number } {
  const result: Record<string, unknown> = {};
  let i = start;
  let isArray = false;
  const arr: unknown[] = [];

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }

    const indent = getIndent(line);
    if (indent < baseIndent) break;
    if (indent > baseIndent && i > start) break;

    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith("- ")) {
      isArray = true;
      const val = trimmed.slice(2).trim();
      if (val.includes(": ")) {
        // Inline map in array
        const obj: Record<string, unknown> = {};
        const kvMatch = val.match(/^(\S+):\s*(.*)$/);
        if (kvMatch) {
          obj[kvMatch[1]] = parseScalar(kvMatch[2]);
          // Check for more keys at deeper indent
          const nextIndent = indent + 2;
          let j = i + 1;
          while (j < lines.length) {
            const nl = lines[j];
            if (!nl.trim() || nl.trim().startsWith("#")) { j++; continue; }
            if (getIndent(nl) < nextIndent) break;
            if (getIndent(nl) === nextIndent) {
              const nkv = nl.trim().match(/^(\S+):\s*(.*)$/);
              if (nkv) {
                obj[nkv[1]] = parseScalar(nkv[2]);
                j++;
                continue;
              }
            }
            break;
          }
          arr.push(obj);
          i = j;
          continue;
        }
      }
      arr.push(parseScalar(val));
      i++;
      continue;
    }

    // Key-value pair
    const kvMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const val = kvMatch[2].trim();

      if (!val) {
        // Block value (nested object or array)
        const nextLine = i + 1;
        if (nextLine < lines.length) {
          const nextTrimmed = lines[nextLine]?.trim() || "";
          const nextIndent = getIndent(lines[nextLine] || "");
          if (nextIndent > indent && nextTrimmed) {
            const sub = parseBlock(lines, nextLine, nextIndent);
            result[key] = sub.value;
            i = sub.nextLine;
            continue;
          }
        }
        result[key] = null;
        i++;
      } else {
        result[key] = parseScalar(val);
        i++;
      }
      continue;
    }

    i++;
  }

  if (isArray) return { value: arr, nextLine: i };
  return { value: result, nextLine: i };
}

function parseScalar(val: string): unknown {
  if (!val || val === "~" || val === "null") return null;
  if (val === "true") return true;
  if (val === "false") return false;
  if (/^-?\d+$/.test(val)) return parseInt(val);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  // Strip quotes
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    return val.slice(1, -1);
  }
  // Inline array
  if (val.startsWith("[") && val.endsWith("]")) {
    return val
      .slice(1, -1)
      .split(",")
      .map((v) => parseScalar(v.trim()));
  }
  return val;
}

// JSON to YAML converter
function jsonToYaml(obj: unknown, indent: number = 0): string {
  const pad = "  ".repeat(indent);

  if (obj === null || obj === undefined) return "null";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") {
    if (
      obj.includes(":") ||
      obj.includes("#") ||
      obj.includes("\n") ||
      obj.startsWith(" ") ||
      obj.endsWith(" ") ||
      obj === "" ||
      /^[{[\]},]/.test(obj)
    ) {
      return `"${obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj
      .map((item) => {
        const val = jsonToYaml(item, indent + 1);
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          // Object in array: put first key on same line
          const firstNewline = val.indexOf("\n");
          if (firstNewline === -1) return `${pad}- ${val}`;
          return `${pad}- ${val}`;
        }
        return `${pad}- ${val}`;
      })
      .join("\n");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    return entries
      .map(([key, value]) => {
        if (
          typeof value === "object" &&
          value !== null &&
          (Array.isArray(value)
            ? value.length > 0
            : Object.keys(value).length > 0)
        ) {
          return `${pad}${key}:\n${jsonToYaml(value, indent + 1)}`;
        }
        return `${pad}${key}: ${jsonToYaml(value, indent + 1)}`;
      })
      .join("\n");
  }
  return String(obj);
}

export default function YamlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [error, setError] = useState("");
  const { copy, Toast } = useCopyToast();

  const convert = () => {
    setError("");
    try {
      if (mode === "yaml-to-json") {
        const parsed = parseYaml(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setOutput("");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">YAML to JSON Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert between YAML and JSON formats. Supports nested objects, arrays,
        and common YAML features.
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => { setMode("yaml-to-json"); setOutput(""); setError(""); }}
          className={mode === "yaml-to-json" ? "btn" : "btn-secondary"}
        >
          YAML → JSON
        </button>
        <button
          onClick={() => { setMode("json-to-yaml"); setOutput(""); setError(""); }}
          className={mode === "json-to-yaml" ? "btn" : "btn-secondary"}
        >
          JSON → YAML
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "yaml-to-json"
            ? "name: John Doe\nage: 30\nhobbies:\n  - coding\n  - gaming"
            : '{\n  "name": "John Doe",\n  "age": 30\n}'
        }
        rows={10}
        spellCheck={false}
        className="font-mono text-sm"
      />

      <button onClick={convert} className="btn mt-3 mb-4">
        Convert
      </button>

      {error && (
        <div className="text-red-400 text-sm mb-3 p-3 rounded-lg bg-red-400/10 border border-red-400/20">
          {error}
        </div>
      )}

      {output && (
        <div className="relative">
          <button
            onClick={() => copy(output)}
            className="btn-secondary absolute top-2 right-2 text-xs"
          >
            Copy
          </button>
          <pre className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      <Toast />
    </div>
  );
}
