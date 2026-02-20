"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type Mode = "encode" | "decode";
type Format = "binary" | "hex" | "decimal" | "octal";

function textToBinary(text: string, sep: string): string {
  return Array.from(text).map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(sep);
}

function textToHex(text: string, sep: string): string {
  return Array.from(text).map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(sep);
}

function textToDecimal(text: string, sep: string): string {
  return Array.from(text).map((c) => c.charCodeAt(0).toString(10)).join(sep);
}

function textToOctal(text: string, sep: string): string {
  return Array.from(text).map((c) => c.charCodeAt(0).toString(8).padStart(3, "0")).join(sep);
}

function binaryToText(binary: string): string {
  const clean = binary.replace(/[^01]/g, " ").trim();
  if (!clean) return "";
  const bytes = clean.split(/\s+/);
  return bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}

function hexToText(hex: string): string {
  const clean = hex.replace(/[^0-9a-fA-F]/g, " ").trim();
  if (!clean) return "";
  const bytes = clean.split(/\s+/);
  return bytes.map((b) => String.fromCharCode(parseInt(b, 16))).join("");
}

function decimalToText(dec: string): string {
  const clean = dec.trim();
  if (!clean) return "";
  const nums = clean.split(/\s+/);
  return nums.map((n) => String.fromCharCode(parseInt(n, 10))).join("");
}

function octalToText(oct: string): string {
  const clean = oct.replace(/[^0-7]/g, " ").trim();
  if (!clean) return "";
  const bytes = clean.split(/\s+/);
  return bytes.map((b) => String.fromCharCode(parseInt(b, 8))).join("");
}

export default function TextToBinaryPage() {
  const { copy, Toast } = useCopyToast();
  const [mode, setMode] = useState<Mode>("encode");
  const [format, setFormat] = useState<Format>("binary");
  const [input, setInput] = useState("Hello World");
  const [separator, setSeparator] = useState(" ");

  const output = useMemo(() => {
    if (!input) return "";
    try {
      if (mode === "encode") {
        switch (format) {
          case "binary": return textToBinary(input, separator);
          case "hex": return textToHex(input, separator);
          case "decimal": return textToDecimal(input, separator);
          case "octal": return textToOctal(input, separator);
        }
      } else {
        switch (format) {
          case "binary": return binaryToText(input);
          case "hex": return hexToText(input);
          case "decimal": return decimalToText(input);
          case "octal": return octalToText(input);
        }
      }
    } catch {
      return "Invalid input";
    }
  }, [input, mode, format, separator]);

  // For encode mode, show all formats at once
  const allFormats = useMemo(() => {
    if (mode !== "encode" || !input) return null;
    return {
      binary: textToBinary(input, " "),
      hex: textToHex(input, " "),
      decimal: textToDecimal(input, " "),
      octal: textToOctal(input, " "),
    };
  }, [input, mode]);

  return (
    <main className="tool-container">
      <h1 className="tool-title">Text to Binary Converter</h1>
      <p className="tool-desc">
        Convert text to binary, hexadecimal, decimal, or octal. Decode back to text.
      </p>

      {/* Mode + Format */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button key={m} className={mode === m ? "btn" : "btn btn-secondary"}
            onClick={() => { setMode(m); setInput(""); }}
            style={{ textTransform: "capitalize" }}>
            {m === "encode" ? "Text to Code" : "Code to Text"}
          </button>
        ))}
        <span style={{ width: 16 }} />
        {(["binary", "hex", "decimal", "octal"] as Format[]).map((f) => (
          <button key={f} className={format === f ? "btn" : "btn btn-secondary"}
            onClick={() => setFormat(f)}
            style={{ textTransform: "capitalize" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Separator (encode only) */}
      {mode === "encode" && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>Separator:</span>
          {[" ", "", "\n"].map((s, i) => (
            <button key={i} className={separator === s ? "btn" : "btn btn-secondary"}
              onClick={() => setSeparator(s)}
              style={{ fontSize: 12, minWidth: 50 }}>
              {s === " " ? "Space" : s === "" ? "None" : "Newline"}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Enter text to convert..." : `Enter ${format} to decode...`}
        rows={4}
        style={{
          width: "100%",
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 12,
          fontFamily: "monospace",
          fontSize: 14,
          resize: "vertical",
          marginBottom: 16,
        }}
      />

      {/* Output */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          {mode === "encode" ? `${format.charAt(0).toUpperCase() + format.slice(1)} Output` : "Decoded Text"}
        </span>
        <button className="btn btn-secondary" onClick={() => copy(output)} style={{ fontSize: 12 }} disabled={!output}>
          Copy
        </button>
      </div>
      <div style={{
        background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)",
        padding: 16, fontFamily: "monospace", fontSize: 13, whiteSpace: "pre-wrap", wordBreak: "break-all",
        marginBottom: 16, minHeight: 60,
      }}>
        {output || "Output will appear here..."}
      </div>

      {/* All formats (encode mode) */}
      {allFormats && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>All Formats</span>
          {(Object.entries(allFormats) as [Format, string][]).map(([fmt, val]) => (
            <div key={fmt} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: "var(--muted)", fontSize: 12, textTransform: "uppercase" }}>{fmt}</span>
                <button onClick={() => copy(val)} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: 12 }}>Copy</button>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 12, wordBreak: "break-all" }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      <Toast />
    </main>
  );
}
