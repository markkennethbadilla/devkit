"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type SortMode = "alpha" | "alpha-desc" | "numeric" | "numeric-desc" | "length" | "length-desc" | "random" | "reverse";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "alpha", label: "A → Z" },
  { value: "alpha-desc", label: "Z → A" },
  { value: "numeric", label: "0 → 9" },
  { value: "numeric-desc", label: "9 → 0" },
  { value: "length", label: "Short → Long" },
  { value: "length-desc", label: "Long → Short" },
  { value: "random", label: "Shuffle" },
  { value: "reverse", label: "Reverse Lines" },
];

function processLines(
  text: string,
  sortMode: SortMode,
  dedupe: boolean,
  trimLines: boolean,
  removeEmpty: boolean,
  caseSensitive: boolean
): string {
  let lines = text.split(/\r?\n/);

  if (trimLines) {
    lines = lines.map((l) => l.trim());
  }

  if (removeEmpty) {
    lines = lines.filter((l) => l.trim() !== "");
  }

  if (dedupe) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  switch (sortMode) {
    case "alpha":
      lines.sort((a, b) =>
        caseSensitive
          ? a.localeCompare(b)
          : a.toLowerCase().localeCompare(b.toLowerCase())
      );
      break;
    case "alpha-desc":
      lines.sort((a, b) =>
        caseSensitive
          ? b.localeCompare(a)
          : b.toLowerCase().localeCompare(a.toLowerCase())
      );
      break;
    case "numeric":
      lines.sort((a, b) => {
        const na = parseFloat(a) || 0;
        const nb = parseFloat(b) || 0;
        return na - nb;
      });
      break;
    case "numeric-desc":
      lines.sort((a, b) => {
        const na = parseFloat(a) || 0;
        const nb = parseFloat(b) || 0;
        return nb - na;
      });
      break;
    case "length":
      lines.sort((a, b) => a.length - b.length);
      break;
    case "length-desc":
      lines.sort((a, b) => b.length - a.length);
      break;
    case "random":
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      break;
    case "reverse":
      lines.reverse();
      break;
  }

  return lines.join("\n");
}

export default function TextSortDedupe() {
  const [input, setInput] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("alpha");
  const [dedupe, setDedupe] = useState(false);
  const [trimLines, setTrimLines] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const { copy, Toast } = useCopyToast();

  const output = useMemo(
    () =>
      input
        ? processLines(input, sortMode, dedupe, trimLines, removeEmpty, caseSensitive)
        : "",
    [input, sortMode, dedupe, trimLines, removeEmpty, caseSensitive]
  );

  const inputLines = input ? input.split(/\r?\n/).length : 0;
  const outputLines = output ? output.split(/\r?\n/).length : 0;
  const removed = inputLines - outputLines;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Text Sort & Deduplicate</h1>
      <p className="text-[var(--muted)] mb-6">
        Sort lines alphabetically, numerically, or by length. Remove duplicates,
        trim whitespace, and filter empty lines.
      </p>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="text-sm px-3 py-2 rounded border border-[var(--border)] bg-[var(--surface)]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <span className="text-sm">Deduplicate</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <span className="text-sm">Trim</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmpty}
            onChange={(e) => setRemoveEmpty(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <span className="text-sm">Remove Empty</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <span className="text-sm">Case Sensitive</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--muted)]">
              Input ({inputLines} lines)
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"banana\napple\ncherry\napple\ndate\nbanana"}
            rows={12}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--muted)]">
              Output ({outputLines} lines
              {removed > 0 ? `, ${removed} removed` : ""})
            </span>
            {output && (
              <button
                onClick={() => copy(output)}
                className="btn-secondary text-xs"
              >
                Copy
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            rows={12}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <Toast />
    </div>
  );
}
