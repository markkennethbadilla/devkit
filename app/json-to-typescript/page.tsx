"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toTypeName(key: string): string {
  // Convert snake_case or kebab-case to PascalCase
  return key
    .split(/[-_]/)
    .map((p) => capitalize(p))
    .join("");
}

interface GenOptions {
  rootName: string;
  useInterface: boolean;
  exportTypes: boolean;
  optionalFields: boolean;
  readonlyFields: boolean;
}

function inferType(
  value: unknown,
  key: string,
  interfaces: Map<string, string>,
  options: GenOptions,
  depth: number
): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const t = typeof value;
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    // Collect unique types from array elements
    const types = new Set<string>();
    for (const item of value) {
      types.add(inferType(item, key, interfaces, options, depth));
    }
    const union = Array.from(types).join(" | ");
    return types.size === 1 ? `${union}[]` : `(${union})[]`;
  }

  if (t === "object") {
    const interfaceName = depth === 0 ? options.rootName : toTypeName(key);
    generateInterface(value as Record<string, unknown>, interfaceName, interfaces, options, depth);
    return interfaceName;
  }

  return "unknown";
}

function generateInterface(
  obj: Record<string, unknown>,
  name: string,
  interfaces: Map<string, string>,
  options: GenOptions,
  depth: number
): void {
  const keyword = options.useInterface ? "interface" : "type";
  const exp = options.exportTypes ? "export " : "";
  const readonly = options.readonlyFields ? "readonly " : "";
  const optional = options.optionalFields ? "?" : "";

  const lines: string[] = [];
  const entries = Object.entries(obj);

  for (const [key, value] of entries) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    const type = inferType(value, key, interfaces, options, depth + 1);
    lines.push(`  ${readonly}${safeKey}${optional}: ${type};`);
  }

  const body = lines.join("\n");
  if (options.useInterface) {
    interfaces.set(name, `${exp}${keyword} ${name} {\n${body}\n}`);
  } else {
    interfaces.set(name, `${exp}${keyword} ${name} = {\n${body}\n};`);
  }
}

function jsonToTs(json: string, options: GenOptions): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(json);
    const interfaces = new Map<string, string>();

    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      generateInterface(parsed, options.rootName, interfaces, options, 0);
    } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "object") {
      generateInterface(parsed[0] as Record<string, unknown>, options.rootName, interfaces, options, 0);
    } else {
      return {
        output: `${options.exportTypes ? "export " : ""}type ${options.rootName} = ${typeof parsed};`,
        error: null,
      };
    }

    // Output in reverse order so nested types come first
    const entries = Array.from(interfaces.entries()).reverse();
    return { output: entries.map(([, v]) => v).join("\n\n"), error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

const SAMPLE = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "roles": ["admin", "editor"],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "62701",
    "coordinates": {
      "lat": 39.7817,
      "lng": -89.6501
    }
  },
  "orders": [
    {
      "orderId": "ORD-001",
      "total": 59.99,
      "items": ["Widget", "Gadget"]
    }
  ],
  "metadata": null
}`;

export default function JsonToTypescriptPage() {
  const [input, setInput] = useState(SAMPLE);
  const [options, setOptions] = useState<GenOptions>({
    rootName: "Root",
    useInterface: true,
    exportTypes: true,
    optionalFields: false,
    readonlyFields: false,
  });
  const { copy, Toast } = useCopyToast();

  const result = useMemo(() => jsonToTs(input, options), [input, options]);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        JSON to TypeScript
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Generate TypeScript interfaces from JSON data. Handles nested objects, arrays, and union types.
      </p>

      {/* Options */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
          Root name:
          <input
            type="text"
            value={options.rootName}
            onChange={(e) => setOptions({ ...options, rootName: e.target.value || "Root" })}
            style={{
              width: 100,
              padding: "4px 8px",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </label>

        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={options.useInterface}
            onChange={(e) => setOptions({ ...options, useInterface: e.target.checked })}
          />
          interface (vs type)
        </label>

        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={options.exportTypes}
            onChange={(e) => setOptions({ ...options, exportTypes: e.target.checked })}
          />
          export
        </label>

        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={options.optionalFields}
            onChange={(e) => setOptions({ ...options, optionalFields: e.target.checked })}
          />
          optional (?)
        </label>

        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={options.readonlyFields}
            onChange={(e) => setOptions({ ...options, readonlyFields: e.target.checked })}
          />
          readonly
        </label>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>JSON Input</span>
            <button className="btn-secondary" onClick={() => setInput("")} style={{ fontSize: "0.75rem", padding: "2px 8px" }}>
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="Paste your JSON here..."
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>TypeScript Output</span>
            <button
              className="btn"
              onClick={() => copy(result.output)}
              disabled={!result.output}
              style={{ fontSize: "0.75rem", padding: "2px 8px" }}
            >
              Copy
            </button>
          </div>
          {result.error ? (
            <div
              style={{
                minHeight: 400,
                padding: "0.8rem",
                borderRadius: 8,
                border: "1px solid #ef444444",
                background: "#ef444411",
                color: "#ef4444",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: 1.5,
              }}
            >
              Error: {result.error}
            </div>
          ) : (
            <pre
              style={{
                minHeight: 400,
                padding: "0.8rem",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                overflow: "auto",
                margin: 0,
              }}
            >
              {result.output || "Paste JSON to generate TypeScript"}
            </pre>
          )}
        </div>
      </div>

      <Toast />
    </main>
  );
}
