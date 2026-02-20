"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type OutputFormat = "array-of-objects" | "array-of-arrays" | "keyed";

export default function CsvToJsonPage() {
  const { copy, Toast } = useCopyToast();
  const [csv, setCsv] = useState(`name,age,city
Alice,30,New York
Bob,25,London
Charlie,35,Tokyo`);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("array-of-objects");
  const [keyColumn, setKeyColumn] = useState(0);

  const result = useMemo(() => {
    try {
      if (!csv.trim()) return { json: "", headers: [] as string[], error: "" };
      const lines = csv.trim().split(/\r?\n/);
      if (lines.length === 0) return { json: "[]", headers: [] as string[], error: "" };

      const d = delimiter === "\\t" ? "\t" : delimiter || ",";
      const rows = lines.map((l) => l.split(d).map((c) => c.trim()));
      const headers = hasHeaders ? rows[0] : rows[0].map((_, i) => `col${i + 1}`);
      const data = hasHeaders ? rows.slice(1) : rows;

      let output: unknown;
      if (format === "array-of-objects") {
        output = data.map((row) => {
          const obj: Record<string, string | number> = {};
          headers.forEach((h, i) => {
            const val = row[i] ?? "";
            obj[h] = isNaN(Number(val)) || val === "" ? val : Number(val);
          });
          return obj;
        });
      } else if (format === "array-of-arrays") {
        output = hasHeaders ? [headers, ...data] : data;
      } else {
        const obj: Record<string, Record<string, string | number>> = {};
        data.forEach((row) => {
          const key = row[keyColumn] ?? `row_${Object.keys(obj).length}`;
          const inner: Record<string, string | number> = {};
          headers.forEach((h, i) => {
            if (i !== keyColumn) {
              const val = row[i] ?? "";
              inner[h] = isNaN(Number(val)) || val === "" ? val : Number(val);
            }
          });
          obj[key] = inner;
        });
        output = obj;
      }

      return { json: JSON.stringify(output, null, 2), headers, error: "" };
    } catch (e) {
      return { json: "", headers: [] as string[], error: String(e) };
    }
  }, [csv, delimiter, hasHeaders, format, keyColumn]);

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
    borderRadius: 6, padding: "8px 10px", fontSize: 14, fontFamily: "monospace", width: "100%",
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSV to JSON Converter</h1>
      <p className="tool-desc">Convert CSV data to JSON. Supports custom delimiters and multiple output formats.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Delimiter</span>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)}
            style={{ ...inputStyle, width: 100 }}>
            <option value=",">,</option>
            <option value=";">;</option>
            <option value="\t">Tab</option>
            <option value="|">|</option>
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Output Format</span>
          <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}
            style={{ ...inputStyle, width: 180 }}>
            <option value="array-of-objects">Array of Objects</option>
            <option value="array-of-arrays">Array of Arrays</option>
            <option value="keyed">Keyed by Column</option>
          </select>
        </label>
        {format === "keyed" && (
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>Key Column</span>
            <select value={keyColumn} onChange={(e) => setKeyColumn(Number(e.target.value))}
              style={{ ...inputStyle, width: 120 }}>
              {result.headers.map((h, i) => (
                <option key={i} value={i}>{h}</option>
              ))}
            </select>
          </label>
        )}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, alignSelf: "flex-end", cursor: "pointer" }}>
          <input type="checkbox" checked={hasHeaders} onChange={(e) => setHasHeaders(e.target.checked)} />
          <span style={{ color: "var(--muted)" }}>First row is headers</span>
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>CSV Input</div>
          <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={14}
            style={{ ...inputStyle, resize: "vertical" }} spellCheck={false} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>JSON Output</span>
            <button className="btn btn-secondary" onClick={() => copy(result.json)} style={{ fontSize: 12 }}>Copy</button>
          </div>
          {result.error ? (
            <div style={{ color: "#ef4444", fontSize: 13, padding: 12 }}>{result.error}</div>
          ) : (
            <textarea value={result.json} readOnly rows={14}
              style={{ ...inputStyle, resize: "vertical" }} />
          )}
        </div>
      </div>

      <Toast />
    </main>
  );
}
