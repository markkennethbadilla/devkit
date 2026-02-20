"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// Simple JSONPath implementation
// Supports: $, .key, [n], [*], ..key (recursive descent), [start:end]
function queryJSONPath(data: unknown, path: string): unknown[] {
  if (!path.startsWith("$")) return [];

  const tokens = tokenize(path.slice(1));
  let current: unknown[] = [data];

  for (const token of tokens) {
    const next: unknown[] = [];
    for (const item of current) {
      if (token.type === "key") {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const obj = item as Record<string, unknown>;
          if (token.value in obj) next.push(obj[token.value]);
        }
      } else if (token.type === "index") {
        if (Array.isArray(item)) {
          const idx = parseInt(token.value);
          const i = idx < 0 ? item.length + idx : idx;
          if (i >= 0 && i < item.length) next.push(item[i]);
        }
      } else if (token.type === "wildcard") {
        if (Array.isArray(item)) {
          next.push(...item);
        } else if (item && typeof item === "object") {
          next.push(...Object.values(item as Record<string, unknown>));
        }
      } else if (token.type === "recursive") {
        const found = recursiveDescend(item, token.value);
        next.push(...found);
      } else if (token.type === "slice") {
        if (Array.isArray(item)) {
          const [start, end] = token.value.split(":").map((s: string) =>
            s === "" ? undefined : parseInt(s)
          );
          const s = start ?? 0;
          const e = end ?? item.length;
          next.push(...item.slice(s, e));
        }
      } else if (token.type === "filter") {
        if (Array.isArray(item)) {
          for (const el of item) {
            if (el && typeof el === "object") {
              const obj = el as Record<string, unknown>;
              if (evaluateFilter(obj, token.value)) {
                next.push(el);
              }
            }
          }
        }
      }
    }
    current = next;
  }

  return current;
}

interface Token {
  type: "key" | "index" | "wildcard" | "recursive" | "slice" | "filter";
  value: string;
}

function tokenize(path: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < path.length) {
    if (path[i] === ".") {
      if (path[i + 1] === ".") {
        // Recursive descent
        i += 2;
        let key = "";
        while (i < path.length && path[i] !== "." && path[i] !== "[") {
          key += path[i++];
        }
        if (key) tokens.push({ type: "recursive", value: key });
      } else {
        i++;
        let key = "";
        while (i < path.length && path[i] !== "." && path[i] !== "[") {
          key += path[i++];
        }
        if (key === "*") {
          tokens.push({ type: "wildcard", value: "*" });
        } else if (key) {
          tokens.push({ type: "key", value: key });
        }
      }
    } else if (path[i] === "[") {
      i++;
      let content = "";
      let depth = 1;
      while (i < path.length && depth > 0) {
        if (path[i] === "[") depth++;
        if (path[i] === "]") depth--;
        if (depth > 0) content += path[i];
        i++;
      }

      if (content === "*") {
        tokens.push({ type: "wildcard", value: "*" });
      } else if (content.startsWith("?")) {
        tokens.push({ type: "filter", value: content.slice(1).trim() });
      } else if (content.includes(":")) {
        tokens.push({ type: "slice", value: content });
      } else if (/^-?\d+$/.test(content)) {
        tokens.push({ type: "index", value: content });
      } else {
        // Quoted key
        const key = content.replace(/^['"]|['"]$/g, "");
        tokens.push({ type: "key", value: key });
      }
    } else {
      i++;
    }
  }

  return tokens;
}

function recursiveDescend(data: unknown, key: string): unknown[] {
  const results: unknown[] = [];

  function search(obj: unknown) {
    if (!obj || typeof obj !== "object") return;

    if (Array.isArray(obj)) {
      for (const item of obj) search(item);
    } else {
      const record = obj as Record<string, unknown>;
      if (key in record) results.push(record[key]);
      for (const val of Object.values(record)) search(val);
    }
  }

  search(data);
  return results;
}

function evaluateFilter(obj: Record<string, unknown>, expr: string): boolean {
  // Simple filter: (@.key==value) or (@.key>value) etc
  const match = expr.match(
    /\(\s*@\.(\w+)\s*(==|!=|>|<|>=|<=)\s*(.+?)\s*\)/
  );
  if (!match) {
    // Check for existence: (@.key)
    const existMatch = expr.match(/\(\s*@\.(\w+)\s*\)/);
    if (existMatch) return existMatch[1] in obj;
    return false;
  }

  const [, fieldKey, op, rawVal] = match;
  const fieldVal = obj[fieldKey];
  let compareVal: string | number = rawVal.replace(/^['"]|['"]$/g, "");

  // Try numeric comparison
  const numField = Number(fieldVal);
  const numCompare = Number(compareVal);
  const isNumeric = !isNaN(numField) && !isNaN(numCompare);

  if (isNumeric) {
    switch (op) {
      case "==": return numField === numCompare;
      case "!=": return numField !== numCompare;
      case ">": return numField > numCompare;
      case "<": return numField < numCompare;
      case ">=": return numField >= numCompare;
      case "<=": return numField <= numCompare;
    }
  } else {
    const sv = String(fieldVal);
    compareVal = String(compareVal);
    switch (op) {
      case "==": return sv === compareVal;
      case "!=": return sv !== compareVal;
      default: return sv.localeCompare(compareVal) === (op === ">" ? 1 : op === "<" ? -1 : 0);
    }
  }

  return false;
}

// Get all paths in JSON for autocomplete
function getAllPaths(data: unknown, prefix = "$"): string[] {
  const paths: string[] = [prefix];

  if (Array.isArray(data)) {
    paths.push(`${prefix}[*]`);
    if (data.length > 0) {
      paths.push(...getAllPaths(data[0], `${prefix}[0]`));
    }
  } else if (data && typeof data === "object") {
    for (const key of Object.keys(data as Record<string, unknown>)) {
      const safePath = /^[a-zA-Z_]\w*$/.test(key)
        ? `${prefix}.${key}`
        : `${prefix}['${key}']`;
      paths.push(safePath);
      paths.push(...getAllPaths((data as Record<string, unknown>)[key], safePath));
    }
  }

  return paths;
}

const SAMPLE_JSON = `{
  "store": {
    "name": "DevBooks",
    "books": [
      { "title": "JavaScript Patterns", "author": "Stoyan Stefanov", "price": 29.99, "inStock": true },
      { "title": "Clean Code", "author": "Robert C. Martin", "price": 34.99, "inStock": true },
      { "title": "The Pragmatic Programmer", "author": "David Thomas", "price": 44.95, "inStock": false },
      { "title": "Refactoring", "author": "Martin Fowler", "price": 39.99, "inStock": true }
    ],
    "location": { "city": "San Francisco", "state": "CA" }
  }
}`;

const EXAMPLES = [
  { path: "$.store.name", label: "Store name" },
  { path: "$.store.books[*].title", label: "All book titles" },
  { path: "$.store.books[0]", label: "First book" },
  { path: "$.store.books[-1]", label: "Last book" },
  { path: "$.store.books[0:2]", label: "First 2 books" },
  { path: "$..price", label: "All prices (recursive)" },
  { path: "$..author", label: "All authors (recursive)" },
  { path: "$.store.books[?(@.price<35)]", label: "Books under $35" },
  { path: "$.store.books[?(@.inStock==true)]", label: "In-stock books" },
];

export default function JSONPathFinderPage() {
  const [json, setJson] = useState(SAMPLE_JSON);
  const [path, setPath] = useState("$.store.books[*].title");
  const { copy, Toast } = useCopyToast();

  const { parsed, error } = useMemo(() => {
    try {
      return { parsed: JSON.parse(json), error: null };
    } catch (e) {
      return { parsed: null, error: (e as Error).message };
    }
  }, [json]);

  const result = useMemo(() => {
    if (!parsed || !path) return null;
    try {
      return queryJSONPath(parsed, path);
    } catch {
      return null;
    }
  }, [parsed, path]);

  const paths = useMemo(() => {
    if (!parsed) return [];
    return getAllPaths(parsed).slice(0, 100);
  }, [parsed]);

  const resultStr = result
    ? JSON.stringify(result.length === 1 ? result[0] : result, null, 2)
    : "";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">JSON Path Finder</h1>
      <p className="text-[var(--muted)] mb-6">
        Query and extract data from JSON using JSONPath expressions. Supports
        dot notation, wildcards, recursive descent, slices, and filters.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            JSON Input
          </label>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            rows={16}
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
            Result
            {result && (
              <span className="ml-2 text-xs">
                ({result.length} match{result.length !== 1 ? "es" : ""})
              </span>
            )}
          </label>
          <div
            onClick={() => resultStr && copy(resultStr)}
            className="cursor-pointer hover:border-[var(--accent)] transition-colors"
            style={{
              minHeight: "22.5rem",
              padding: "0.75rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "var(--foreground)",
              whiteSpace: "pre-wrap",
              overflowY: "auto",
              maxHeight: "22.5rem",
            }}
            title="Click to copy"
          >
            {resultStr || (
              <span style={{ color: "var(--muted)" }}>
                {path ? "No matches found" : "Enter a JSONPath expression"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Path input */}
      <div className="mb-4">
        <label className="text-sm text-[var(--muted)] mb-1 block">
          JSONPath Expression
        </label>
        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="$.store.books[*].title"
          spellCheck={false}
          className="font-mono"
          style={{
            width: "100%",
            padding: "0.6rem 0.75rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--foreground)",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {/* Example queries */}
      <div className="mb-6">
        <div className="text-sm text-[var(--muted)] mb-2">
          Example expressions:
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.path}
              onClick={() => setPath(ex.path)}
              className="text-xs px-2 py-1 rounded border transition-colors"
              style={{
                background:
                  path === ex.path ? "var(--accent)" : "var(--surface)",
                color: path === ex.path ? "#fff" : "var(--muted)",
                borderColor: "var(--border)",
                cursor: "pointer",
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available paths */}
      {paths.length > 0 && (
        <details className="mb-4">
          <summary
            className="text-sm cursor-pointer"
            style={{ color: "var(--accent)" }}
          >
            Available paths ({paths.length})
          </summary>
          <div
            className="mt-2 flex flex-wrap gap-1"
            style={{ maxHeight: 200, overflowY: "auto" }}
          >
            {paths.map((p) => (
              <button
                key={p}
                onClick={() => setPath(p)}
                className="text-xs px-2 py-0.5 rounded font-mono hover:bg-[var(--accent)] hover:text-white transition-colors"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </details>
      )}

      <Toast />
    </div>
  );
}
