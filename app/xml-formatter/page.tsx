"use client";

import { useState, useMemo, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function formatXml(xml: string, indent: number): string {
  const PADDING = " ".repeat(indent);
  let formatted = "";
  let depth = 0;
  // Remove existing whitespace between tags
  const cleaned = xml.replace(/>\s*</g, "><").trim();

  const tokens = cleaned.match(/<[^>]+>|[^<]+/g);
  if (!tokens) return xml;

  for (const token of tokens) {
    if (token.startsWith("</")) {
      // Closing tag
      depth--;
      formatted += PADDING.repeat(depth) + token + "\n";
    } else if (token.startsWith("<?")) {
      // Processing instruction
      formatted += PADDING.repeat(depth) + token + "\n";
    } else if (token.startsWith("<!--")) {
      // Comment
      formatted += PADDING.repeat(depth) + token + "\n";
    } else if (token.startsWith("<") && token.endsWith("/>")) {
      // Self-closing tag
      formatted += PADDING.repeat(depth) + token + "\n";
    } else if (token.startsWith("<")) {
      // Opening tag
      formatted += PADDING.repeat(depth) + token + "\n";
      depth++;
    } else {
      // Text content
      const trimmed = token.trim();
      if (trimmed) {
        formatted += PADDING.repeat(depth) + trimmed + "\n";
      }
    }
  }

  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .replace(/>\s/g, ">")
    .replace(/\s</g, "<")
    .trim();
}

function validateXml(xml: string): { valid: boolean; error: string | null } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const errorNode = doc.querySelector("parsererror");
    if (errorNode) {
      return { valid: false, error: errorNode.textContent || "Invalid XML" };
    }
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: "Failed to parse XML" };
  }
}

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
<book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer's Guide</title><genre>Computer</genre><price>44.95</price><publish_date>2000-10-01</publish_date><description>An in-depth look at creating applications with XML.</description></book>
<book id="bk102"><author>Ralls, Kim</author><title>Midnight Rain</title><genre>Fantasy</genre><price>5.95</price><publish_date>2000-12-16</publish_date><description>A former architect battles corporate zombies.</description></book>
</catalog>`;

export default function XmlFormatterPage() {
  const [input, setInput] = useState(SAMPLE);
  const [indentSize, setIndentSize] = useState(2);
  const { copy, Toast } = useCopyToast();

  const formatted = useMemo(() => {
    if (!input.trim()) return "";
    return formatXml(input, indentSize);
  }, [input, indentSize]);

  const minified = useMemo(() => {
    if (!input.trim()) return "";
    return minifyXml(input);
  }, [input]);

  const validation = useMemo(() => {
    if (!input.trim()) return { valid: true, error: null };
    return validateXml(input);
  }, [input]);

  const stats = useMemo(() => {
    const orig = new Blob([input]).size;
    const fmt = new Blob([formatted]).size;
    const min = new Blob([minified]).size;
    return { original: orig, formatted: fmt, minified: min };
  }, [input, formatted, minified]);

  const handleFormat = useCallback(() => {
    setInput(formatted);
  }, [formatted]);

  const handleMinify = useCallback(() => {
    setInput(minified);
  }, [minified]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        XML Formatter & Minifier
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Format, beautify, and minify XML. Validates structure and shows size stats.
      </p>

      {/* Validation badge */}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 6,
            fontSize: "0.82rem",
            fontWeight: 600,
            background: !input.trim()
              ? "var(--surface)"
              : validation.valid
              ? "#22c55e22"
              : "#ef444422",
            color: !input.trim()
              ? "var(--muted)"
              : validation.valid
              ? "#22c55e"
              : "#ef4444",
          }}
        >
          {!input.trim() ? "Empty" : validation.valid ? "Valid XML" : "Invalid XML"}
        </span>
        {validation.error && (
          <span style={{ fontSize: "0.8rem", color: "#ef4444" }}>{validation.error}</span>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
        <button className="btn" onClick={handleFormat}>
          Format / Beautify
        </button>
        <button className="btn-secondary" onClick={handleMinify}>
          Minify
        </button>
        <button className="btn-secondary" onClick={() => copy(input)}>
          Copy
        </button>
        <button className="btn-secondary" onClick={() => setInput("")}>
          Clear
        </button>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto",
            fontSize: "0.85rem",
          }}
        >
          Indent:
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              fontSize: "0.85rem",
            }}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={8}>Tab (8)</option>
          </select>
        </label>
      </div>

      {/* Editor */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        placeholder="Paste your XML here..."
        style={{
          width: "100%",
          minHeight: 380,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          padding: "1rem",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--foreground)",
          resize: "vertical",
          lineHeight: 1.6,
        }}
      />

      {/* Stats */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginTop: "1rem",
          fontSize: "0.82rem",
          color: "var(--muted)",
          flexWrap: "wrap",
        }}
      >
        <span>Original: {stats.original.toLocaleString()} bytes</span>
        <span>Formatted: {stats.formatted.toLocaleString()} bytes</span>
        <span>
          Minified: {stats.minified.toLocaleString()} bytes
          {stats.original > 0 && (
            <>
              {" "}
              ({Math.round(((stats.original - stats.minified) / stats.original) * 100)}% smaller)
            </>
          )}
        </span>
      </div>

      <Toast />
    </main>
  );
}
