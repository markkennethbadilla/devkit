"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// Lightweight TOML parser — handles common TOML features
// Supports: key/value pairs, strings, numbers, booleans, arrays, inline tables,
// [table] headers, [[array of tables]], multi-line basic strings, dates

function parseTOML(input: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let currentTable = root;
  let currentPath: string[] = [];
  const lines = input.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines and comments
    if (!line || line.startsWith("#")) continue;

    // Array of tables [[...]]
    if (line.startsWith("[[") && line.endsWith("]]")) {
      const path = line.slice(2, -2).trim().split(".");
      currentPath = path;
      let obj = root;
      for (let j = 0; j < path.length - 1; j++) {
        if (!(path[j] in obj)) obj[path[j]] = {};
        obj = obj[path[j]] as Record<string, unknown>;
      }
      const lastKey = path[path.length - 1];
      if (!(lastKey in obj)) obj[lastKey] = [];
      const arr = obj[lastKey] as unknown[];
      const newTable: Record<string, unknown> = {};
      arr.push(newTable);
      currentTable = newTable;
      continue;
    }

    // Table [...]
    if (line.startsWith("[") && line.endsWith("]")) {
      const path = line.slice(1, -1).trim().split(".");
      currentPath = path;
      let obj = root;
      for (const key of path) {
        if (!(key in obj)) obj[key] = {};
        const val = obj[key];
        if (Array.isArray(val)) {
          obj = val[val.length - 1] as Record<string, unknown>;
        } else {
          obj = val as Record<string, unknown>;
        }
      }
      currentTable = obj;
      continue;
    }

    // Key = Value
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;

    let key = line.slice(0, eqIdx).trim();
    // Handle quoted keys
    if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
      key = key.slice(1, -1);
    }

    let valueStr = line.slice(eqIdx + 1).trim();

    // Handle multi-line basic strings
    if (valueStr.startsWith('"""')) {
      let multiLine = valueStr.slice(3);
      while (!multiLine.includes('"""') && i < lines.length - 1) {
        i++;
        multiLine += "\n" + lines[i];
      }
      const endIdx = multiLine.indexOf('"""');
      const strVal = endIdx >= 0 ? multiLine.slice(0, endIdx) : multiLine;
      currentTable[key] = strVal.replace(/^\n/, "");
      continue;
    }

    // Handle multi-line literal strings
    if (valueStr.startsWith("'''")) {
      let multiLine = valueStr.slice(3);
      while (!multiLine.includes("'''") && i < lines.length - 1) {
        i++;
        multiLine += "\n" + lines[i];
      }
      const endIdx = multiLine.indexOf("'''");
      const strVal = endIdx >= 0 ? multiLine.slice(0, endIdx) : multiLine;
      currentTable[key] = strVal.replace(/^\n/, "");
      continue;
    }

    // Strip inline comments (not inside strings)
    if (!valueStr.startsWith('"') && !valueStr.startsWith("'")) {
      const commentIdx = valueStr.indexOf("#");
      if (commentIdx >= 0) valueStr = valueStr.slice(0, commentIdx).trim();
    }

    // Handle dotted keys
    const keyParts = key.split(".");
    if (keyParts.length > 1) {
      let obj = currentTable;
      for (let j = 0; j < keyParts.length - 1; j++) {
        const k = keyParts[j].trim();
        if (!(k in obj)) obj[k] = {};
        obj = obj[k] as Record<string, unknown>;
      }
      obj[keyParts[keyParts.length - 1].trim()] = parseValue(valueStr);
    } else {
      currentTable[key] = parseValue(valueStr);
    }
  }

  return root;
}

function parseValue(val: string): unknown {
  val = val.trim();

  // String (basic)
  if (val.startsWith('"') && val.endsWith('"')) {
    return val.slice(1, -1)
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\\\/g, "\\")
      .replace(/\\"/g, '"');
  }

  // String (literal)
  if (val.startsWith("'") && val.endsWith("'")) {
    return val.slice(1, -1);
  }

  // Boolean
  if (val === "true") return true;
  if (val === "false") return false;

  // Date/DateTime
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(val)) {
    return val; // Keep as string for JSON output
  }

  // Number (integer with underscores, hex, oct, bin)
  if (/^0x[0-9a-fA-F_]+$/.test(val)) return parseInt(val.replace(/_/g, ""), 16);
  if (/^0o[0-7_]+$/.test(val)) return parseInt(val.replace(/_/g, "").slice(2), 8);
  if (/^0b[01_]+$/.test(val)) return parseInt(val.replace(/_/g, "").slice(2), 2);

  // Float special values
  if (val === "inf" || val === "+inf") return Infinity;
  if (val === "-inf") return -Infinity;
  if (val === "nan" || val === "+nan" || val === "-nan") return NaN;

  // Number
  const num = Number(val.replace(/_/g, ""));
  if (!isNaN(num) && val !== "") return num;

  // Array
  if (val.startsWith("[") && val.endsWith("]")) {
    return parseArray(val);
  }

  // Inline table
  if (val.startsWith("{") && val.endsWith("}")) {
    return parseInlineTable(val);
  }

  return val;
}

function parseArray(val: string): unknown[] {
  const inner = val.slice(1, -1).trim();
  if (!inner) return [];

  const result: unknown[] = [];
  let current = "";
  let depth = 0;
  let inString = false;
  let quote = "";

  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (inString) {
      current += ch;
      if (ch === quote && inner[i - 1] !== "\\") inString = false;
    } else if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      current += ch;
    } else if (ch === "[" || ch === "{") {
      depth++;
      current += ch;
    } else if (ch === "]" || ch === "}") {
      depth--;
      current += ch;
    } else if (ch === "," && depth === 0) {
      if (current.trim()) result.push(parseValue(current.trim()));
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) result.push(parseValue(current.trim()));

  return result;
}

function parseInlineTable(val: string): Record<string, unknown> {
  const inner = val.slice(1, -1).trim();
  if (!inner) return {};

  const result: Record<string, unknown> = {};
  const pairs = inner.split(",");
  for (const pair of pairs) {
    const eqIdx = pair.indexOf("=");
    if (eqIdx === -1) continue;
    const key = pair.slice(0, eqIdx).trim().replace(/^["']|["']$/g, "");
    result[key] = parseValue(pair.slice(eqIdx + 1).trim());
  }

  return result;
}

// JSON to TOML converter
function jsonToTOML(data: unknown, prefix = ""): string {
  if (typeof data !== "object" || data === null) {
    return tomlValue(data);
  }

  if (Array.isArray(data)) {
    return "[" + data.map(tomlValue).join(", ") + "]";
  }

  const obj = data as Record<string, unknown>;
  const lines: string[] = [];
  const tables: string[] = [];

  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const safeKey = /^[a-zA-Z0-9_-]+$/.test(key) ? key : `"${key}"`;

    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && !Array.isArray(val[0])) {
      // Array of tables
      for (const item of val) {
        tables.push(`\n[[${fullKey}]]`);
        tables.push(jsonToTOML(item, "").replace(/^\n/, ""));
      }
    } else if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      // Nested table
      tables.push(`\n[${fullKey}]`);
      tables.push(jsonToTOML(val, fullKey).replace(/^\n/, ""));
    } else {
      lines.push(`${safeKey} = ${tomlValue(val)}`);
    }
  }

  return [...lines, ...tables].join("\n");
}

function tomlValue(val: unknown): string {
  if (typeof val === "string") return `"${val.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return String(val);
  if (val === null || val === undefined) return '""';
  if (Array.isArray(val)) return "[" + val.map(tomlValue).join(", ") + "]";
  if (typeof val === "object") {
    const entries = Object.entries(val as Record<string, unknown>)
      .map(([k, v]) => `${k} = ${tomlValue(v)}`)
      .join(", ");
    return `{ ${entries} }`;
  }
  return String(val);
}

const SAMPLE_TOML = `# Server configuration
title = "My App"
debug = false

[server]
host = "localhost"
port = 8080
workers = 4

[database]
url = "postgres://localhost/mydb"
pool_size = 5
ssl = true

[[users]]
name = "Alice"
role = "admin"
permissions = ["read", "write", "delete"]

[[users]]
name = "Bob"
role = "viewer"
permissions = ["read"]

[metadata]
version = "1.2.3"
tags = ["web", "api", "config"]
created = 2026-01-15`;

export default function TOMLToJSONPage() {
  const [input, setInput] = useState(SAMPLE_TOML);
  const [mode, setMode] = useState<"toml-to-json" | "json-to-toml">("toml-to-json");
  const { copy, Toast } = useCopyToast();

  const { output, error } = useMemo(() => {
    try {
      if (mode === "toml-to-json") {
        const parsed = parseTOML(input);
        return { output: JSON.stringify(parsed, null, 2), error: null };
      } else {
        const parsed = JSON.parse(input);
        return { output: jsonToTOML(parsed), error: null };
      }
    } catch (e) {
      return { output: "", error: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">TOML to JSON Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert between TOML and JSON formats. Supports tables, arrays of
        tables, inline tables, multi-line strings, and more.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          className={mode === "toml-to-json" ? "btn" : "btn-secondary"}
          onClick={() => setMode("toml-to-json")}
        >
          TOML to JSON
        </button>
        <button
          className={mode === "json-to-toml" ? "btn" : "btn-secondary"}
          onClick={() => setMode("json-to-toml")}
        >
          JSON to TOML
        </button>
        <button
          className="btn-secondary"
          onClick={() => {
            if (output && !error) {
              setInput(output);
              setMode(mode === "toml-to-json" ? "json-to-toml" : "toml-to-json");
            }
          }}
        >
          Swap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            {mode === "toml-to-json" ? "TOML" : "JSON"} Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={20}
            spellCheck={false}
            className="font-mono text-sm"
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "var(--surface)",
              border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
              borderRadius: 8,
              color: "var(--foreground)",
              resize: "vertical",
            }}
          />
          {error && (
            <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            {mode === "toml-to-json" ? "JSON" : "TOML"} Output
          </label>
          <div
            onClick={() => output && copy(output)}
            className="cursor-pointer hover:border-[var(--accent)] transition-colors"
            style={{
              minHeight: "28.5rem",
              maxHeight: "28.5rem",
              overflowY: "auto",
              padding: "0.75rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "var(--foreground)",
              whiteSpace: "pre-wrap",
            }}
            title="Click to copy"
          >
            {output || (
              <span style={{ color: "var(--muted)" }}>
                {error ? "Fix errors to see output" : "Enter input to convert"}
              </span>
            )}
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );
}
