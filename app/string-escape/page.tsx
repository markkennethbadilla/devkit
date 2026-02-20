"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type EscapeMode = "json" | "html" | "url" | "xml" | "csv" | "regex" | "sql" | "backslash";

interface EscapeModeInfo {
  id: EscapeMode;
  label: string;
  escape: (s: string) => string;
  unescape: (s: string) => string;
}

const MODES: EscapeModeInfo[] = [
  {
    id: "json",
    label: "JSON",
    escape: (s) =>
      JSON.stringify(s).slice(1, -1), // strip surrounding quotes
    unescape: (s) => {
      try {
        return JSON.parse(`"${s}"`);
      } catch {
        return s;
      }
    },
  },
  {
    id: "html",
    label: "HTML",
    escape: (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;"),
    unescape: (s) =>
      s
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " "),
  },
  {
    id: "url",
    label: "URL",
    escape: (s) => encodeURIComponent(s),
    unescape: (s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    },
  },
  {
    id: "xml",
    label: "XML",
    escape: (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;"),
    unescape: (s) =>
      s
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'"),
  },
  {
    id: "csv",
    label: "CSV",
    escape: (s) =>
      s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s,
    unescape: (s) => {
      if (s.startsWith('"') && s.endsWith('"')) {
        return s.slice(1, -1).replace(/""/g, '"');
      }
      return s;
    },
  },
  {
    id: "regex",
    label: "Regex",
    escape: (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    unescape: (s) => s.replace(/\\([.*+?^${}()|[\]\\])/g, "$1"),
  },
  {
    id: "sql",
    label: "SQL",
    escape: (s) => s.replace(/'/g, "''"),
    unescape: (s) => s.replace(/''/g, "'"),
  },
  {
    id: "backslash",
    label: "Backslash",
    escape: (s) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t")
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'"),
    unescape: (s) =>
      s
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\"),
  },
];

export default function StringEscape() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<EscapeMode>("json");
  const [direction, setDirection] = useState<"escape" | "unescape">("escape");
  const { copy, Toast } = useCopyToast();

  const modeInfo = MODES.find((m) => m.id === mode)!;

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return direction === "escape"
        ? modeInfo.escape(input)
        : modeInfo.unescape(input);
    } catch {
      return "Error processing string";
    }
  }, [input, mode, direction, modeInfo]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">String Escape / Unescape</h1>
      <p className="text-[var(--muted)] mb-6">
        Escape and unescape strings for different contexts. Supports JSON, HTML,
        URL, XML, CSV, regex, SQL, and backslash escaping.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={mode === m.id ? "btn" : "btn-secondary"}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDirection("escape")}
          className={direction === "escape" ? "btn" : "btn-secondary"}
        >
          Escape
        </button>
        <button
          onClick={() => setDirection("unescape")}
          className={direction === "unescape" ? "btn" : "btn-secondary"}
        >
          Unescape
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-[var(--muted)] mb-2">Input</div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === "escape"
                ? 'Hello "World" <script>alert(\'XSS\')</script>'
                : "Hello &quot;World&quot; &lt;script&gt;"
            }
            rows={8}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--muted)]">Output</span>
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
            rows={8}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <Toast />
    </div>
  );
}
