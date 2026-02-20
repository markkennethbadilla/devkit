"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type Unit = "px" | "em" | "rem" | "pt" | "pc" | "in" | "cm" | "mm" | "vh" | "vw" | "%" | "ch" | "ex";

const UNITS: { id: Unit; name: string; desc: string }[] = [
  { id: "px", name: "Pixels", desc: "Screen pixels (1/96 inch)" },
  { id: "em", name: "em", desc: "Relative to parent font-size" },
  { id: "rem", name: "rem", desc: "Relative to root font-size" },
  { id: "pt", name: "Points", desc: "1pt = 1/72 inch" },
  { id: "pc", name: "Picas", desc: "1pc = 12pt" },
  { id: "in", name: "Inches", desc: "1in = 96px" },
  { id: "cm", name: "Centimeters", desc: "1cm = 37.8px" },
  { id: "mm", name: "Millimeters", desc: "1mm = 3.78px" },
  { id: "vh", name: "vh", desc: "1% of viewport height" },
  { id: "vw", name: "vw", desc: "1% of viewport width" },
  { id: "%", name: "Percent", desc: "Relative to parent element" },
  { id: "ch", name: "ch", desc: "Width of '0' character" },
  { id: "ex", name: "ex", desc: "Height of 'x' character" },
];

function toPx(value: number, unit: Unit, baseFontSize: number, viewportW: number, viewportH: number, parentSize: number): number {
  switch (unit) {
    case "px": return value;
    case "em": return value * parentSize;
    case "rem": return value * baseFontSize;
    case "pt": return value * (96 / 72);
    case "pc": return value * (96 / 6);
    case "in": return value * 96;
    case "cm": return value * (96 / 2.54);
    case "mm": return value * (96 / 25.4);
    case "vh": return value * (viewportH / 100);
    case "vw": return value * (viewportW / 100);
    case "%": return value * (parentSize / 100);
    case "ch": return value * baseFontSize * 0.5;
    case "ex": return value * baseFontSize * 0.45;
    default: return value;
  }
}

function fromPx(px: number, unit: Unit, baseFontSize: number, viewportW: number, viewportH: number, parentSize: number): number {
  switch (unit) {
    case "px": return px;
    case "em": return px / parentSize;
    case "rem": return px / baseFontSize;
    case "pt": return px / (96 / 72);
    case "pc": return px / (96 / 6);
    case "in": return px / 96;
    case "cm": return px / (96 / 2.54);
    case "mm": return px / (96 / 25.4);
    case "vh": return px / (viewportH / 100);
    case "vw": return px / (viewportW / 100);
    case "%": return px / (parentSize / 100);
    case "ch": return px / (baseFontSize * 0.5);
    case "ex": return px / (baseFontSize * 0.45);
    default: return px;
  }
}

function fmt(n: number): string {
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(2);
  const s = n.toFixed(4);
  return s.replace(/\.?0+$/, "") || "0";
}

export default function CssUnitsConverterPage() {
  const { copy, Toast } = useCopyToast();
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState<Unit>("px");
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [viewportW, setViewportW] = useState(1920);
  const [viewportH, setViewportH] = useState(1080);
  const [parentSize, setParentSize] = useState(16);

  const conversions = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const px = toPx(v, fromUnit, baseFontSize, viewportW, viewportH, parentSize);
    return UNITS.map((u) => ({
      ...u,
      value: fromPx(px, u.id, baseFontSize, viewportW, viewportH, parentSize),
    }));
  }, [value, fromUnit, baseFontSize, viewportW, viewportH, parentSize]);

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
    borderRadius: 6, padding: "8px 10px", fontSize: 14, fontFamily: "monospace", width: "100%",
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSS Units Converter</h1>
      <p className="tool-desc">Convert between all CSS units with customizable base values for viewport, font size, and parent element.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "end" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, flex: 1, minWidth: 130 }}>
          <span style={{ color: "var(--muted)" }}>Value</span>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={inputStyle} />
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as Unit)} style={{ ...inputStyle, width: 80 }}>
              {UNITS.map((u) => <option key={u.id} value={u.id}>{u.id}</option>)}
            </select>
          </div>
        </label>
      </div>

      {/* Context settings */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 8, marginBottom: 20, padding: 12, background: "var(--surface)",
        border: "1px solid var(--border)", borderRadius: 8,
      }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
          <span style={{ color: "var(--muted)" }}>Root font-size (px)</span>
          <input type="number" value={baseFontSize} onChange={(e) => setBaseFontSize(Number(e.target.value) || 16)} style={{ ...inputStyle, fontSize: 12 }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
          <span style={{ color: "var(--muted)" }}>Parent font-size (px)</span>
          <input type="number" value={parentSize} onChange={(e) => setParentSize(Number(e.target.value) || 16)} style={{ ...inputStyle, fontSize: 12 }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
          <span style={{ color: "var(--muted)" }}>Viewport width (px)</span>
          <input type="number" value={viewportW} onChange={(e) => setViewportW(Number(e.target.value) || 1920)} style={{ ...inputStyle, fontSize: 12 }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
          <span style={{ color: "var(--muted)" }}>Viewport height (px)</span>
          <input type="number" value={viewportH} onChange={(e) => setViewportH(Number(e.target.value) || 1080)} style={{ ...inputStyle, fontSize: 12 }} />
        </label>
      </div>

      {/* Results */}
      {conversions && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 8 }}>
          {conversions.map((c) => (
            <div key={c.id} style={{
              background: c.id === fromUnit ? "var(--accent)" : "var(--surface)",
              color: c.id === fromUnit ? "#fff" : "var(--foreground)",
              border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", cursor: "pointer",
            }} onClick={() => copy(`${fmt(c.value)}${c.id}`)}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{c.name} ({c.id})</div>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, wordBreak: "break-all" }}>
                {fmt(c.value)}<span style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}>{c.id}</span>
              </div>
              <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      )}

      <Toast />
    </main>
  );
}
