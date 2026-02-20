"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL",
  "LIKE", "BETWEEN", "EXISTS", "HAVING", "GROUP BY", "ORDER BY",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
  "ALTER TABLE", "DROP TABLE", "JOIN", "INNER JOIN", "LEFT JOIN",
  "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "ON", "AS", "DISTINCT",
  "LIMIT", "OFFSET", "UNION", "UNION ALL", "EXCEPT", "INTERSECT",
  "CASE", "WHEN", "THEN", "ELSE", "END", "ASC", "DESC", "INTO",
  "CREATE INDEX", "DROP INDEX", "WITH", "RECURSIVE", "RETURNING",
  "FETCH", "NEXT", "ROWS", "ONLY", "OVER", "PARTITION BY", "WINDOW",
];

// Multi-word keywords first (longest match wins)
const SORTED_KEYWORDS = [...KEYWORDS].sort((a, b) => b.length - a.length);

const MAJOR_CLAUSES = new Set([
  "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING",
  "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
  "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "JOIN", "INNER JOIN",
  "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "ON",
  "LIMIT", "OFFSET", "UNION", "UNION ALL", "EXCEPT", "INTERSECT",
  "WITH", "RETURNING", "WINDOW",
]);

const INDENT_AFTER = new Set(["SELECT", "SET", "VALUES"]);

function formatSQL(sql: string, uppercaseKw: boolean, indentSize: number): string {
  // Tokenize: preserve strings, identifiers, comments
  const tokens: { type: "string" | "comment" | "word" | "symbol" | "space"; value: string }[] = [];
  let i = 0;

  while (i < sql.length) {
    // Single-line comment
    if (sql[i] === "-" && sql[i + 1] === "-") {
      let j = i;
      while (j < sql.length && sql[j] !== "\n") j++;
      tokens.push({ type: "comment", value: sql.slice(i, j) });
      i = j;
      continue;
    }
    // Block comment
    if (sql[i] === "/" && sql[i + 1] === "*") {
      let j = i + 2;
      while (j < sql.length - 1 && !(sql[j] === "*" && sql[j + 1] === "/")) j++;
      tokens.push({ type: "comment", value: sql.slice(i, j + 2) });
      i = j + 2;
      continue;
    }
    // String literal
    if (sql[i] === "'" || sql[i] === '"') {
      const quote = sql[i];
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === quote && sql[j + 1] === quote) { j += 2; continue; }
        if (sql[j] === quote) { j++; break; }
        j++;
      }
      tokens.push({ type: "string", value: sql.slice(i, j) });
      i = j;
      continue;
    }
    // Whitespace
    if (/\s/.test(sql[i])) {
      let j = i;
      while (j < sql.length && /\s/.test(sql[j])) j++;
      tokens.push({ type: "space", value: " " });
      i = j;
      continue;
    }
    // Symbols
    if (/[(),;*=<>!+\-/%]/.test(sql[i])) {
      // Handle multi-char operators
      if (i + 1 < sql.length && ["<>", "<=", ">=", "!=", "||", "::"].includes(sql.slice(i, i + 2))) {
        tokens.push({ type: "symbol", value: sql.slice(i, i + 2) });
        i += 2;
      } else {
        tokens.push({ type: "symbol", value: sql[i] });
        i++;
      }
      continue;
    }
    // Word (identifier or keyword)
    let j = i;
    while (j < sql.length && /\w/.test(sql[j])) j++;
    if (j > i) {
      tokens.push({ type: "word", value: sql.slice(i, j) });
      i = j;
    } else {
      tokens.push({ type: "symbol", value: sql[i] });
      i++;
    }
  }

  // Now format
  const indent = " ".repeat(indentSize);
  const lines: string[] = [];
  let currentLine = "";
  let depth = 0;
  let parenDepth = 0;

  const pushLine = () => {
    if (currentLine.trim()) {
      lines.push(indent.repeat(depth) + currentLine.trim());
    }
    currentLine = "";
  };

  const nonSpaceTokens = tokens.filter((t) => t.type !== "space");

  for (let ti = 0; ti < nonSpaceTokens.length; ti++) {
    const token = nonSpaceTokens[ti];

    if (token.type === "comment") {
      pushLine();
      lines.push(indent.repeat(depth) + token.value);
      continue;
    }

    if (token.type === "string") {
      currentLine += (currentLine ? " " : "") + token.value;
      continue;
    }

    if (token.type === "symbol") {
      if (token.value === "(") {
        currentLine += " (";
        parenDepth++;
      } else if (token.value === ")") {
        parenDepth--;
        currentLine += ")";
      } else if (token.value === ",") {
        if (parenDepth > 0) {
          currentLine += ", ";
        } else {
          currentLine += ",";
          pushLine();
        }
      } else if (token.value === ";") {
        currentLine += ";";
        pushLine();
        depth = 0;
        lines.push("");
      } else {
        currentLine += (currentLine && !currentLine.endsWith("(") ? " " : "") + token.value;
      }
      continue;
    }

    // Word token — check if it starts a multi-word keyword
    const upper = token.value.toUpperCase();
    let matchedKw = "";
    for (const kw of SORTED_KEYWORDS) {
      const parts = kw.split(" ");
      if (parts[0] !== upper) continue;
      let match = true;
      for (let p = 1; p < parts.length; p++) {
        const ahead = nonSpaceTokens[ti + p];
        if (!ahead || ahead.value.toUpperCase() !== parts[p]) {
          match = false;
          break;
        }
      }
      if (match) {
        matchedKw = kw;
        ti += parts.length - 1; // skip consumed tokens
        break;
      }
    }

    if (matchedKw) {
      const display = uppercaseKw ? matchedKw : matchedKw.toLowerCase();
      if (MAJOR_CLAUSES.has(matchedKw) && parenDepth === 0) {
        pushLine();
        if (INDENT_AFTER.has(matchedKw)) {
          currentLine = display;
          pushLine();
          depth = 1;
        } else {
          depth = 0;
          currentLine = display;
        }
      } else {
        currentLine += (currentLine ? " " : "") + display;
      }
    } else {
      const display = token.value;
      currentLine += (currentLine ? " " : "") + display;
    }
  }

  pushLine();
  return lines.join("\n").trim();
}

function minifySQL(sql: string): string {
  // Strip comments, collapse whitespace
  let result = sql
    .replace(/--[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();
  return result;
}

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [uppercaseKw, setUppercaseKw] = useState(true);
  const [indentSize, setIndentSize] = useState(2);
  const { copy, Toast } = useCopyToast();

  const format = () => {
    try {
      setOutput(formatSQL(input, uppercaseKw, indentSize));
    } catch {
      setOutput("Error formatting SQL");
    }
  };

  const minify = () => {
    setOutput(minifySQL(input));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">SQL Formatter</h1>
      <p className="text-[var(--muted)] mb-6">
        Format, beautify, or minify SQL queries. Supports major SQL dialects
        with keyword uppercasing and configurable indentation.
      </p>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <button onClick={format} className="btn">
          Format
        </button>
        <button onClick={minify} className="btn-secondary">
          Minify
        </button>

        <label className="flex items-center gap-2 ml-auto">
          <input
            type="checkbox"
            checked={uppercaseKw}
            onChange={(e) => setUppercaseKw(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <span className="text-sm">Uppercase Keywords</span>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Indent:</span>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(+e.target.value)}
            className="text-sm px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)]"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>Tab (8)</option>
          </select>
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="SELECT u.id, u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.total > 100 ORDER BY o.total DESC;"
        rows={8}
        spellCheck={false}
        className="font-mono text-sm"
      />

      {output && (
        <div className="relative mt-4">
          <button
            onClick={() => copy(output)}
            className="btn-secondary absolute top-2 right-2 text-xs"
          >
            Copy
          </button>
          <pre className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-x-auto text-sm font-mono whitespace-pre">
            {output}
          </pre>
        </div>
      )}

      <Toast />
    </div>
  );
}
