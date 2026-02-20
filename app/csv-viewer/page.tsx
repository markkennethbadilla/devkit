"use client";

import { useState, useMemo } from "react";

function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === "\n" || (char === "\r" && nextChar === "\n")) {
        currentRow.push(currentField);
        currentField = "";
        if (currentRow.some((f) => f.trim() !== "")) {
          rows.push(currentRow);
        }
        currentRow = [];
        if (char === "\r") i++; // skip \n
      } else {
        currentField += char;
      }
    }
  }

  // Last field
  currentRow.push(currentField);
  if (currentRow.some((f) => f.trim() !== "")) {
    rows.push(currentRow);
  }

  return rows;
}

const sampleCsv = `Name,Age,City,Score
Alice,28,New York,95
Bob,35,San Francisco,87
Charlie,22,Chicago,92
Diana,31,Boston,88
Eve,27,Seattle,96
Frank,42,Denver,78`;

export default function CsvViewerPage() {
  const [input, setInput] = useState(sampleCsv);
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const parsed = useMemo(() => {
    if (!input.trim()) return { headers: [], rows: [] };
    const all = parseCsv(input, delimiter);
    if (all.length === 0) return { headers: [], rows: [] };

    const headers = hasHeader ? all[0] : all[0].map((_, i) => `Column ${i + 1}`);
    const rows = hasHeader ? all.slice(1) : all;
    return { headers, rows };
  }, [input, delimiter, hasHeader]);

  const filteredRows = useMemo(() => {
    let rows = parsed.rows;
    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(s)));
    }
    if (sortCol !== null) {
      rows = [...rows].sort((a, b) => {
        const va = a[sortCol] || "";
        const vb = b[sortCol] || "";
        const na = parseFloat(va);
        const nb = parseFloat(vb);
        if (!isNaN(na) && !isNaN(nb)) {
          return sortAsc ? na - nb : nb - na;
        }
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    return rows;
  }, [parsed.rows, search, sortCol, sortAsc]);

  const handleSort = (col: number) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">CSV Viewer</h1>
      <p className="text-[var(--muted)] mb-6">
        Paste CSV data and view it in a sortable, searchable table. Click column headers to sort.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">CSV Input</label>
        <textarea
          className="w-full h-40 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your CSV data here..."
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Delimiter</label>
          <select
            className="rounded bg-[var(--card)] border border-[var(--border)] p-2 text-sm"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
          >
            <option value=",">Comma (,)</option>
            <option value={"\t"}>Tab</option>
            <option value=";">Semicolon (;)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />
          First row is header
        </label>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            className="w-full rounded bg-[var(--card)] border border-[var(--border)] p-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter rows..."
          />
        </div>
      </div>

      {parsed.headers.length > 0 && (
        <div className="mb-4 text-sm text-[var(--muted)]">
          {filteredRows.length} row{filteredRows.length !== 1 ? "s" : ""} &middot; {parsed.headers.length} column{parsed.headers.length !== 1 ? "s" : ""}
        </div>
      )}

      {parsed.headers.length > 0 && (
        <div className="overflow-x-auto rounded border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--card)]">
                {parsed.headers.map((h, i) => (
                  <th
                    key={i}
                    className="text-left p-2 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--border)] select-none whitespace-nowrap"
                    onClick={() => handleSort(i)}
                  >
                    {h}
                    {sortCol === i && (
                      <span className="ml-1">{sortAsc ? "\u25B2" : "\u25BC"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-[var(--card)]">
                  {parsed.headers.map((_, ci) => (
                    <td key={ci} className="p-2 border-b border-[var(--border)] whitespace-nowrap">
                      {row[ci] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button className="btn-secondary" onClick={() => setInput("")}>
          Clear
        </button>
        <button className="btn-secondary" onClick={() => { setInput(sampleCsv); setSearch(""); setSortCol(null); }}>
          Load Sample
        </button>
      </div>
    </main>
  );
}
