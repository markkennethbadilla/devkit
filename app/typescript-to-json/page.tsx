"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface ParsedField {
  name: string;
  type: string;
  optional: boolean;
}

interface ParsedInterface {
  name: string;
  fields: ParsedField[];
}

function parseInterfaces(ts: string): ParsedInterface[] {
  const interfaces: ParsedInterface[] = [];
  // Match interface or type declarations
  const interfaceRegex = /(?:export\s+)?(?:interface|type)\s+(\w+)\s*(?:=\s*)?\{([^}]*)}/g;
  let match;
  while ((match = interfaceRegex.exec(ts)) !== null) {
    const name = match[1];
    const body = match[2];
    const fields: ParsedField[] = [];

    const lines = body.split(/[;\n]/).filter((l) => l.trim());
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) continue;

      const fieldMatch = trimmed.match(/^(?:readonly\s+)?(\w+)(\??):\s*(.+?)$/);
      if (fieldMatch) {
        fields.push({
          name: fieldMatch[1],
          type: fieldMatch[3].trim().replace(/;$/, "").trim(),
          optional: fieldMatch[2] === "?",
        });
      }
    }

    interfaces.push({ name, fields });
  }
  return interfaces;
}

function generateSampleValue(type: string, fieldName: string, interfaces: ParsedInterface[], depth: number = 0): unknown {
  if (depth > 5) return null;

  const t = type.trim();

  // Primitives
  if (t === "string") {
    // Generate contextual sample values based on field name
    const lower = fieldName.toLowerCase();
    if (lower.includes("email")) return "user@example.com";
    if (lower.includes("name") && lower.includes("first")) return "John";
    if (lower.includes("name") && lower.includes("last")) return "Doe";
    if (lower.includes("name")) return "John Doe";
    if (lower.includes("url") || lower.includes("link") || lower.includes("href")) return "https://example.com";
    if (lower.includes("phone") || lower.includes("tel")) return "+1-555-0100";
    if (lower.includes("address")) return "123 Main St";
    if (lower.includes("city")) return "Springfield";
    if (lower.includes("country")) return "United States";
    if (lower.includes("zip") || lower.includes("postal")) return "62701";
    if (lower.includes("title")) return "Sample Title";
    if (lower.includes("description") || lower.includes("desc")) return "A sample description";
    if (lower.includes("id")) return "abc-123";
    if (lower.includes("color") || lower.includes("colour")) return "#3498db";
    if (lower.includes("date") || lower.includes("time") || lower.includes("created") || lower.includes("updated")) return "2026-01-15T12:00:00Z";
    if (lower.includes("password") || lower.includes("secret")) return "********";
    if (lower.includes("token")) return "eyJhbGciOiJIUzI1NiJ9...";
    if (lower.includes("image") || lower.includes("avatar") || lower.includes("photo")) return "https://example.com/image.jpg";
    if (lower.includes("path")) return "/api/resource";
    return "sample_value";
  }
  if (t === "number" || t === "number | undefined") {
    const lower = fieldName.toLowerCase();
    if (lower.includes("age")) return 25;
    if (lower.includes("price") || lower.includes("cost") || lower.includes("amount")) return 29.99;
    if (lower.includes("count") || lower.includes("total") || lower.includes("quantity")) return 10;
    if (lower.includes("id")) return 1;
    if (lower.includes("port")) return 3000;
    if (lower.includes("year")) return 2026;
    if (lower.includes("lat")) return 40.7128;
    if (lower.includes("lng") || lower.includes("lon")) return -74.006;
    return 42;
  }
  if (t === "boolean") {
    const lower = fieldName.toLowerCase();
    if (lower.includes("active") || lower.includes("enabled") || lower.includes("visible")) return true;
    if (lower.includes("disabled") || lower.includes("deleted") || lower.includes("hidden")) return false;
    return true;
  }
  if (t === "null") return null;
  if (t === "undefined") return undefined;
  if (t === "any" || t === "unknown") return "any_value";
  if (t === "Date") return "2026-01-15T12:00:00.000Z";

  // String literal type
  if (t.startsWith('"') || t.startsWith("'")) {
    return t.replace(/^['"]|['"]$/g, "");
  }

  // Number literal
  if (/^\d+(\.\d+)?$/.test(t)) {
    return Number(t);
  }

  // Union type — pick first option
  if (t.includes("|")) {
    const options = t.split("|").map((o) => o.trim());
    const first = options[0];
    return generateSampleValue(first, fieldName, interfaces, depth);
  }

  // Array type
  if (t.endsWith("[]")) {
    const itemType = t.slice(0, -2).trim();
    return [generateSampleValue(itemType, fieldName, interfaces, depth + 1)];
  }
  if (t.startsWith("Array<") && t.endsWith(">")) {
    const itemType = t.slice(6, -1).trim();
    return [generateSampleValue(itemType, fieldName, interfaces, depth + 1)];
  }

  // Record type
  if (t.startsWith("Record<")) {
    return { key: "value" };
  }

  // Map type
  if (t.startsWith("Map<")) {
    return {};
  }

  // Tuple
  if (t.startsWith("[") && t.endsWith("]")) {
    const inner = t.slice(1, -1);
    return inner.split(",").map((p, i) => generateSampleValue(p.trim(), `item${i}`, interfaces, depth + 1));
  }

  // Referenced interface
  const referenced = interfaces.find((i) => i.name === t);
  if (referenced) {
    return generateSampleFromInterface(referenced, interfaces, depth + 1);
  }

  return `<${t}>`;
}

function generateSampleFromInterface(iface: ParsedInterface, allInterfaces: ParsedInterface[], depth: number = 0): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const field of iface.fields) {
    obj[field.name] = generateSampleValue(field.type, field.name, allInterfaces, depth);
  }
  return obj;
}

const SAMPLE_TS = `interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  age?: number;
  roles: string[];
  address: Address;
  metadata: Record<string, any>;
}

interface Address {
  street: string;
  city: string;
  zip: string;
  country: string;
  coordinates: Coordinates;
}

interface Coordinates {
  lat: number;
  lng: number;
}`;

export default function TypescriptToJsonPage() {
  const [input, setInput] = useState(SAMPLE_TS);
  const { copy, Toast } = useCopyToast();

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", error: null, interfaces: [] };
    try {
      const parsed = parseInterfaces(input);
      if (parsed.length === 0) {
        return { output: "", error: "No interfaces or types found. Define using 'interface Name { ... }' or 'type Name = { ... }'.", interfaces: [] };
      }
      // Generate sample for the first interface
      const sample = generateSampleFromInterface(parsed[0], parsed);
      return { output: JSON.stringify(sample, null, 2), error: null, interfaces: parsed };
    } catch (e) {
      return { output: "", error: (e as Error).message, interfaces: [] };
    }
  }, [input]);

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        TypeScript to JSON
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Generate sample JSON from TypeScript interfaces. Produces contextual values based on field names.
      </p>

      {/* Interface selector if multiple */}
      {result.interfaces.length > 1 && (
        <div style={{ marginBottom: "0.5rem", fontSize: "0.82rem", color: "var(--muted)" }}>
          Found {result.interfaces.length} interfaces: {result.interfaces.map((i) => i.name).join(", ")}. Generating from first ({result.interfaces[0].name}).
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>TypeScript Input</span>
            <button className="btn-secondary" onClick={() => setInput("")} style={{ fontSize: "0.72rem", padding: "2px 8px" }}>
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="Paste TypeScript interfaces..."
            style={{
              width: "100%",
              minHeight: 420,
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>JSON Output</span>
            <button
              className="btn"
              onClick={() => copy(result.output)}
              disabled={!result.output}
              style={{ fontSize: "0.72rem", padding: "2px 8px" }}
            >
              Copy
            </button>
          </div>
          {result.error ? (
            <div
              style={{
                minHeight: 420,
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
              {result.error}
            </div>
          ) : (
            <pre
              style={{
                minHeight: 420,
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
              {result.output || "Paste TypeScript interfaces to generate JSON"}
            </pre>
          )}
        </div>
      </div>

      <Toast />
    </main>
  );
}
