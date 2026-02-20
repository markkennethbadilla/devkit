"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const SEPARATOR_PRESETS = [
  { label: "None", value: "" },
  { label: "Newline", value: "\n" },
  { label: "Space", value: " " },
  { label: "Comma", value: "," },
  { label: "Comma + Space", value: ", " },
  { label: "Tab", value: "\t" },
  { label: "Semicolon", value: ";" },
  { label: "Pipe", value: "|" },
];

export default function TextRepeaterPage() {
  const [text, setText] = useState("Hello World");
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState("\n");
  const [customSep, setCustomSep] = useState("");
  const [useCustomSep, setUseCustomSep] = useState(false);
  const [addIndex, setAddIndex] = useState(false);
  const [indexStart, setIndexStart] = useState(1);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const { copy, Toast } = useCopyToast();

  const output = useMemo(() => {
    if (!text && !prefix && !suffix) return "";
    const sep = useCustomSep ? customSep : separator;
    const lines: string[] = [];
    const safeCount = Math.min(Math.max(1, count), 10000);
    for (let i = 0; i < safeCount; i++) {
      let line = "";
      if (prefix) line += prefix;
      if (addIndex) line += `${indexStart + i} `;
      line += text;
      if (suffix) line += suffix;
      lines.push(line);
    }
    return lines.join(sep);
  }, [text, count, separator, customSep, useCustomSep, addIndex, indexStart, prefix, suffix]);

  const stats = useMemo(() => {
    return {
      chars: output.length,
      lines: output.split("\n").length,
      bytes: new Blob([output]).size,
    };
  }, [output]);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        Text Repeater
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Repeat text multiple times with custom separators, prefixes, suffixes, and numbering.
      </p>

      {/* Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: 4 }}>
          Text to repeat
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          placeholder="Enter text to repeat..."
          style={{
            width: "100%",
            minHeight: 80,
            fontFamily: "monospace",
            fontSize: "0.85rem",
            padding: "0.6rem",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            resize: "vertical",
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <label style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6 }}>
          Repeat:
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            min={1}
            max={10000}
            style={{
              width: 70,
              padding: "4px 8px",
              fontSize: "0.85rem",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--surface)",
              color: "var(--foreground)",
              textAlign: "center",
            }}
          />
          times
        </label>

        <label style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6 }}>
          Prefix:
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder=""
            style={{
              width: 80,
              padding: "4px 8px",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </label>

        <label style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6 }}>
          Suffix:
          <input
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder=""
            style={{
              width: 80,
              padding: "4px 8px",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        </label>

        <label style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={addIndex}
            onChange={(e) => setAddIndex(e.target.checked)}
          />
          Add numbers
        </label>

        {addIndex && (
          <label style={{ fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 4 }}>
            Start:
            <input
              type="number"
              value={indexStart}
              onChange={(e) => setIndexStart(Number(e.target.value))}
              style={{
                width: 55,
                padding: "4px 6px",
                fontSize: "0.85rem",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface)",
                color: "var(--foreground)",
                textAlign: "center",
              }}
            />
          </label>
        )}
      </div>

      {/* Separator */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>Separator</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {SEPARATOR_PRESETS.map((s) => (
            <button
              key={s.label}
              className={!useCustomSep && separator === s.value ? "btn" : "btn-secondary"}
              onClick={() => {
                setSeparator(s.value);
                setUseCustomSep(false);
              }}
              style={{ fontSize: "0.75rem", padding: "3px 10px" }}
            >
              {s.label}
            </button>
          ))}
          <button
            className={useCustomSep ? "btn" : "btn-secondary"}
            onClick={() => setUseCustomSep(true)}
            style={{ fontSize: "0.75rem", padding: "3px 10px" }}
          >
            Custom
          </button>
        </div>
        {useCustomSep && (
          <input
            type="text"
            value={customSep}
            onChange={(e) => setCustomSep(e.target.value)}
            placeholder="Custom separator"
            style={{
              width: 200,
              padding: "4px 8px",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              border: "1px solid var(--border)",
              borderRadius: 6,
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          />
        )}
      </div>

      {/* Output */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Output</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            {stats.chars.toLocaleString()} chars | {stats.lines.toLocaleString()} lines | {stats.bytes.toLocaleString()} bytes
          </span>
          <button className="btn" onClick={() => copy(output)} style={{ fontSize: "0.75rem", padding: "3px 10px" }}>
            Copy
          </button>
        </div>
      </div>
      <textarea
        value={output}
        readOnly
        style={{
          width: "100%",
          minHeight: 200,
          fontFamily: "monospace",
          fontSize: "0.82rem",
          padding: "0.6rem",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--foreground)",
          resize: "vertical",
          lineHeight: 1.5,
        }}
      />

      <Toast />
    </main>
  );
}
