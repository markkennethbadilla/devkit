"use client";
import { useState, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface ValidationError {
  path: string;
  message: string;
}

function validateValue(value: unknown, schema: Record<string, unknown>, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
    if (actualType === "number" && types.includes("integer")) {
      if (!Number.isInteger(value)) errors.push({ path, message: `Expected integer, got float` });
    } else if (!types.includes(actualType)) {
      errors.push({ path, message: `Expected type ${types.join("|")}, got ${actualType}` });
      return errors; // Stop further checks on wrong type
    }
  }

  if (typeof value === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength)
      errors.push({ path, message: `String length ${value.length} < minLength ${schema.minLength}` });
    if (typeof schema.maxLength === "number" && value.length > schema.maxLength)
      errors.push({ path, message: `String length ${value.length} > maxLength ${schema.maxLength}` });
    if (typeof schema.pattern === "string") {
      try {
        if (!new RegExp(schema.pattern).test(value))
          errors.push({ path, message: `Does not match pattern "${schema.pattern}"` });
      } catch { /* */ }
    }
    if (Array.isArray(schema.enum) && !schema.enum.includes(value))
      errors.push({ path, message: `Value not in enum: [${(schema.enum as string[]).join(", ")}]` });
  }

  if (typeof value === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum)
      errors.push({ path, message: `${value} < minimum ${schema.minimum}` });
    if (typeof schema.maximum === "number" && value > schema.maximum)
      errors.push({ path, message: `${value} > maximum ${schema.maximum}` });
    if (typeof schema.exclusiveMinimum === "number" && value <= schema.exclusiveMinimum)
      errors.push({ path, message: `${value} <= exclusiveMinimum ${schema.exclusiveMinimum}` });
    if (typeof schema.exclusiveMaximum === "number" && value >= schema.exclusiveMaximum)
      errors.push({ path, message: `${value} >= exclusiveMaximum ${schema.exclusiveMaximum}` });
    if (typeof schema.multipleOf === "number" && value % schema.multipleOf !== 0)
      errors.push({ path, message: `${value} is not a multiple of ${schema.multipleOf}` });
  }

  if (Array.isArray(value)) {
    if (typeof schema.minItems === "number" && value.length < schema.minItems)
      errors.push({ path, message: `Array length ${value.length} < minItems ${schema.minItems}` });
    if (typeof schema.maxItems === "number" && value.length > schema.maxItems)
      errors.push({ path, message: `Array length ${value.length} > maxItems ${schema.maxItems}` });
    if (schema.items && typeof schema.items === "object") {
      value.forEach((item, i) => {
        errors.push(...validateValue(item, schema.items as Record<string, unknown>, `${path}[${i}]`));
      });
    }
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    if (Array.isArray(schema.required)) {
      for (const key of schema.required as string[]) {
        if (!(key in obj)) errors.push({ path: path ? `${path}.${key}` : key, message: `Required property missing` });
      }
    }
    if (schema.properties && typeof schema.properties === "object") {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (key in obj) {
          errors.push(...validateValue(obj[key], propSchema, path ? `${path}.${key}` : key));
        }
      }
    }
    if (schema.additionalProperties === false) {
      const allowed = schema.properties ? Object.keys(schema.properties as object) : [];
      for (const key of Object.keys(obj)) {
        if (!allowed.includes(key))
          errors.push({ path: path ? `${path}.${key}` : key, message: `Additional property not allowed` });
      }
    }
  }

  return errors;
}

const SAMPLE_SCHEMA = `{
  "type": "object",
  "required": ["name", "age", "email"],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "email": {
      "type": "string",
      "pattern": "^[^@]+@[^@]+\\\\.[^@]+$"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1
    }
  }
}`;

const SAMPLE_DATA = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "tags": ["developer", "designer"]
}`;

export default function JsonSchemaValidatorPage() {
  const { copy, Toast } = useCopyToast();

  const [schema, setSchema] = useState(SAMPLE_SCHEMA);
  const [data, setData] = useState(SAMPLE_DATA);
  const [errors, setErrors] = useState<ValidationError[] | null>(null);
  const [parseError, setParseError] = useState("");

  const validate = useCallback(() => {
    setParseError("");
    setErrors(null);

    let parsedSchema: Record<string, unknown>;
    let parsedData: unknown;

    try {
      parsedSchema = JSON.parse(schema);
    } catch (e) {
      setParseError(`Schema JSON error: ${e instanceof Error ? e.message : "Invalid JSON"}`);
      return;
    }
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      setParseError(`Data JSON error: ${e instanceof Error ? e.message : "Invalid JSON"}`);
      return;
    }

    const result = validateValue(parsedData, parsedSchema, "");
    setErrors(result);
  }, [schema, data]);

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: 12,
    fontFamily: "monospace",
    fontSize: 13,
    resize: "vertical",
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">JSON Schema Validator</h1>
      <p className="tool-desc">
        Validate JSON data against a JSON Schema. Supports type checking, required fields, patterns, min/max, arrays, and nested objects.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>JSON Schema</span>
            <button onClick={() => copy(schema)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12 }}>Copy</button>
          </div>
          <textarea value={schema} onChange={(e) => setSchema(e.target.value)} rows={16} style={textareaStyle} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>JSON Data</span>
            <button onClick={() => copy(data)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12 }}>Copy</button>
          </div>
          <textarea value={data} onChange={(e) => setData(e.target.value)} rows={16} style={textareaStyle} />
        </div>
      </div>

      <button className="btn" onClick={validate} style={{ marginBottom: 16 }}>Validate</button>

      {parseError && (
        <div style={{ background: "#7f1d1d33", borderRadius: 8, border: "1px solid #ef4444", padding: 12, marginBottom: 16, color: "#ef4444", fontSize: 14 }}>
          {parseError}
        </div>
      )}

      {errors !== null && (
        <div style={{
          background: errors.length === 0 ? "#14532d33" : "#7f1d1d33",
          borderRadius: 8,
          border: `1px solid ${errors.length === 0 ? "#22c55e" : "#ef4444"}`,
          padding: 16,
        }}>
          {errors.length === 0 ? (
            <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 15 }}>
              Valid! Data matches the schema.
            </div>
          ) : (
            <>
              <div style={{ color: "#ef4444", fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                {errors.length} validation error{errors.length > 1 ? "s" : ""} found
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {errors.map((err, i) => (
                  <div key={i} style={{ fontSize: 13, fontFamily: "monospace" }}>
                    <span style={{ color: "#f59e0b" }}>{err.path || "(root)"}</span>
                    <span style={{ color: "var(--muted)" }}> — </span>
                    <span>{err.message}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <Toast />
    </main>
  );
}
