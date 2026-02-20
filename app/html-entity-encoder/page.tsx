"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const NAMED_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "\u00A0": "&nbsp;",
  "\u00A9": "&copy;",
  "\u00AE": "&reg;",
  "\u2122": "&trade;",
  "\u2013": "&ndash;",
  "\u2014": "&mdash;",
  "\u2018": "&lsquo;",
  "\u2019": "&rsquo;",
  "\u201C": "&ldquo;",
  "\u201D": "&rdquo;",
  "\u2026": "&hellip;",
};

const REVERSE_ENTITIES: Record<string, string> = {};
for (const [char, entity] of Object.entries(NAMED_ENTITIES)) {
  REVERSE_ENTITIES[entity] = char;
}

function encodeHTML(text: string): string {
  return text.replace(/[&<>"'\u00A0-\uFFFF]/g, (char) => {
    if (NAMED_ENTITIES[char]) return NAMED_ENTITIES[char];
    const code = char.charCodeAt(0);
    return code > 127 ? `&#${code};` : char;
  });
}

function decodeHTML(text: string): string {
  return text
    .replace(/&[a-zA-Z]+;/g, (entity) => REVERSE_ENTITIES[entity] || entity)
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export default function HTMLEntityEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { copy, Toast } = useCopyToast();

  const doConvert = () => {
    setOutput(mode === "encode" ? encodeHTML(input) : decodeHTML(input));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">HTML Entity Encoder / Decoder</h1>
      <p className="text-[var(--muted)] mb-6">
        Encode special characters to HTML entities or decode entities back to readable text.
      </p>

      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="flex rounded-lg overflow-hidden border border-[var(--border)]">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 text-sm transition-colors ${mode === "encode" ? "bg-[var(--accent)] text-white" : "bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--border)]"}`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 text-sm transition-colors ${mode === "decode" ? "bg-[var(--accent)] text-white" : "bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--border)]"}`}
          >
            Decode
          </button>
        </div>
        <button onClick={doConvert} className="btn">Convert</button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="btn btn-secondary">Clear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            {mode === "encode" ? "Plain Text" : "HTML Entities"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? 'e.g. <div class="test">' : "e.g. &lt;div class=&quot;test&quot;&gt;"}
            rows={12}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--muted)]">
              {mode === "encode" ? "HTML Entities" : "Plain Text"}
            </label>
            {output && (
              <button onClick={() => copy(output)} className="text-xs text-[var(--accent)] hover:underline">
                Copy
              </button>
            )}
          </div>
          <textarea value={output} readOnly rows={12} spellCheck={false} />
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <h2 className="text-sm font-semibold mb-2">Common HTML Entities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm font-mono">
          {Object.entries(NAMED_ENTITIES).slice(0, 12).map(([char, entity]) => (
            <div key={entity} className="flex justify-between px-2 py-1 rounded bg-[var(--background)]">
              <span className="text-[var(--muted)]">{entity}</span>
              <span>{char === "\u00A0" ? "\\u00A0" : char}</span>
            </div>
          ))}
        </div>
      </div>

      <Toast />
    </div>
  );
}
