"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function encodeSVGForCSS(svg: string): string {
  // Minimal SVG encoding for use in CSS url()
  return svg
    .replace(/\s+/g, " ")
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B")
    .replace(/}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .trim();
}

function extractDimensions(svg: string): { width: string; height: string } | null {
  const widthMatch = svg.match(/width=["']([^"']+)["']/);
  const heightMatch = svg.match(/height=["']([^"']+)["']/);
  if (widthMatch && heightMatch) {
    return { width: widthMatch[1], height: heightMatch[1] };
  }
  const viewBoxMatch = svg.match(/viewBox=["']([^"']+)["']/);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/[\s,]+/);
    if (parts.length === 4) {
      return { width: parts[2] + "px", height: parts[3] + "px" };
    }
  }
  return null;
}

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <line x1="12" y1="8" x2="12" y2="12"/>
  <line x1="12" y1="16" x2="12.01" y2="16"/>
</svg>`;

export default function SVGToCSSPage() {
  const { copy, Toast } = useCopyToast();
  const [svg, setSvg] = useState(SAMPLE_SVG);
  const [bgSize, setBgSize] = useState("contain");
  const [bgRepeat, setBgRepeat] = useState("no-repeat");
  const [bgPosition, setBgPosition] = useState("center");
  const [includeSize, setIncludeSize] = useState(true);
  const [outputFormat, setOutputFormat] = useState<"background" | "mask">("background");

  const result = useMemo(() => {
    if (!svg.trim()) return { css: "", dataUri: "", preview: "" };

    const encoded = encodeSVGForCSS(svg);
    const dataUri = `url("data:image/svg+xml,${encoded}")`;
    const dims = extractDimensions(svg);

    const lines: string[] = [];
    if (outputFormat === "background") {
      lines.push(`background-image: ${dataUri};`);
      lines.push(`background-size: ${bgSize};`);
      lines.push(`background-repeat: ${bgRepeat};`);
      lines.push(`background-position: ${bgPosition};`);
    } else {
      lines.push(`-webkit-mask-image: ${dataUri};`);
      lines.push(`mask-image: ${dataUri};`);
      lines.push(`-webkit-mask-size: ${bgSize};`);
      lines.push(`mask-size: ${bgSize};`);
      lines.push(`-webkit-mask-repeat: ${bgRepeat};`);
      lines.push(`mask-repeat: ${bgRepeat};`);
      lines.push(`-webkit-mask-position: ${bgPosition};`);
      lines.push(`mask-position: ${bgPosition};`);
    }

    if (includeSize && dims) {
      lines.push(`width: ${dims.width};`);
      lines.push(`height: ${dims.height};`);
    }

    return { css: lines.join("\n"), dataUri, preview: encoded };
  }, [svg, bgSize, bgRepeat, bgPosition, includeSize, outputFormat]);

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "6px 8px",
    fontSize: 13,
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">SVG to CSS Converter</h1>
      <p className="tool-desc">
        Convert inline SVG to a CSS background-image or mask-image data URI. Paste your SVG and get ready-to-use CSS.
      </p>

      {/* SVG Input */}
      <textarea
        value={svg}
        onChange={(e) => setSvg(e.target.value)}
        placeholder="Paste your SVG code here..."
        rows={8}
        style={{
          width: "100%",
          background: "var(--surface)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 12,
          fontFamily: "monospace",
          fontSize: 13,
          resize: "vertical",
          marginBottom: 16,
        }}
      />

      {/* Options */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Format</span>
          <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as "background" | "mask")} style={inputStyle}>
            <option value="background">background-image</option>
            <option value="mask">mask-image</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Size</span>
          <select value={bgSize} onChange={(e) => setBgSize(e.target.value)} style={inputStyle}>
            <option value="contain">contain</option>
            <option value="cover">cover</option>
            <option value="100% 100%">100% 100%</option>
            <option value="auto">auto</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Repeat</span>
          <select value={bgRepeat} onChange={(e) => setBgRepeat(e.target.value)} style={inputStyle}>
            <option value="no-repeat">no-repeat</option>
            <option value="repeat">repeat</option>
            <option value="repeat-x">repeat-x</option>
            <option value="repeat-y">repeat-y</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Position</span>
          <select value={bgPosition} onChange={(e) => setBgPosition(e.target.value)} style={inputStyle}>
            <option value="center">center</option>
            <option value="top left">top left</option>
            <option value="top right">top right</option>
            <option value="bottom left">bottom left</option>
            <option value="bottom right">bottom right</option>
          </select>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={includeSize}
            onChange={(e) => setIncludeSize(e.target.checked)}
          />
          <span style={{ color: "var(--muted)" }}>Include width/height</span>
        </label>
      </div>

      {/* Preview */}
      {svg.trim() && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: "var(--muted)" }}>Preview</h3>
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "center",
              justifyContent: "center",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 24,
              minHeight: 100,
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textAlign: "center" }}>Original SVG</div>
              <div dangerouslySetInnerHTML={{ __html: svg }} style={{ maxWidth: 120, maxHeight: 120 }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textAlign: "center" }}>CSS Result</div>
              <div
                style={{
                  width: 80,
                  height: 80,
                  backgroundImage: `url("data:image/svg+xml,${result.preview}")`,
                  backgroundSize: bgSize,
                  backgroundRepeat: bgRepeat,
                  backgroundPosition: bgPosition,
                  border: "1px dashed var(--border)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS output */}
      <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: "var(--muted)" }}>Generated CSS</h3>
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border)",
          padding: 16,
          fontFamily: "monospace",
          fontSize: 13,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          marginBottom: 12,
          minHeight: 60,
          maxHeight: 300,
          overflowY: "auto",
        }}
      >
        {result.css || "Paste SVG above to generate CSS..."}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={() => copy(result.css)} disabled={!result.css}>
          Copy CSS
        </button>
        <button className="btn btn-secondary" onClick={() => copy(result.dataUri)} disabled={!result.dataUri}>
          Copy Data URI Only
        </button>
      </div>

      <Toast />
    </main>
  );
}
