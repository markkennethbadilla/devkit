"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function jsonToCsv(json: string, delimiter: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Input must be a non-empty JSON array of objects");
  }

  const headers = Array.from(
    new Set(data.flatMap((row: Record<string, unknown>) => Object.keys(row)))
  );

  const escape = (val: unknown): string => {
    const str = val === null || val === undefined ? "" : String(val);
    if (
      str.includes(delimiter) ||
      str.includes('"') ||
      str.includes("\n")
    ) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    headers.map(escape).join(delimiter),
    ...data.map((row: Record<string, unknown>) =>
      headers.map((h) => escape(row[h])).join(delimiter)
    ),
  ];

  return lines.join("\n");
}

function csvToJson(csv: string, delimiter: string): string {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delimiter) {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map((line) => {
    const values = parseRow(line);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? "";
    });
    return obj;
  });

  return JSON.stringify(rows, null, 2);
}

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState("");
  const { copy, Toast } = useCopyToast();

  const convert = () => {
    setError("");
    try {
      if (mode === "json-to-csv") {
        setOutput(jsonToCsv(input, delimiter));
      } else {
        setOutput(csvToJson(input, delimiter));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setOutput("");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">JSON to CSV Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert between JSON arrays and CSV format. Handles quoted fields,
        nested values, and custom delimiters.
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => { setMode("json-to-csv"); setOutput(""); setError(""); }}
          className={mode === "json-to-csv" ? "btn" : "btn-secondary"}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => { setMode("csv-to-json"); setOutput(""); setError(""); }}
          className={mode === "csv-to-json" ? "btn" : "btn-secondary"}
        >
          CSV → JSON
        </button>

        <label className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-[var(--muted)]">Delimiter:</span>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            className="text-sm px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)]"
          >
            <option value=",">Comma (,)</option>
            <option value="&#9;">Tab</option>
            <option value=";">Semicolon (;)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "json-to-csv"
            ? '[{"name":"Alice","age":30},{"name":"Bob","age":25}]'
            : "name,age\nAlice,30\nBob,25"
        }
        rows={8}
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
