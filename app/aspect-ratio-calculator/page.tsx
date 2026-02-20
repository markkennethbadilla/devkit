"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

const COMMON_RATIOS = [
  { name: "16:9", w: 16, h: 9, desc: "Widescreen (HD, 4K)" },
  { name: "4:3", w: 4, h: 3, desc: "Standard display" },
  { name: "21:9", w: 21, h: 9, desc: "Ultrawide" },
  { name: "1:1", w: 1, h: 1, desc: "Square" },
  { name: "3:2", w: 3, h: 2, desc: "Classic photo" },
  { name: "9:16", w: 9, h: 16, desc: "Vertical/Portrait" },
  { name: "2:1", w: 2, h: 1, desc: "Univisium" },
  { name: "5:4", w: 5, h: 4, desc: "Large format photo" },
];

export default function AspectRatioCalculatorPage() {
  const { copy, Toast } = useCopyToast();
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockRatio, setLockRatio] = useState(true);
  const [targetWidth, setTargetWidth] = useState("");
  const [targetHeight, setTargetHeight] = useState("");

  const ratio = useMemo(() => {
    if (!width || !height) return { x: 0, y: 0, decimal: 0, str: "—" };
    const g = gcd(width, height);
    const x = width / g;
    const y = height / g;
    return { x, y, decimal: width / height, str: `${x}:${y}` };
  }, [width, height]);

  const resized = useMemo(() => {
    if (!lockRatio || !ratio.decimal) return { w: "", h: "" };
    if (targetWidth) {
      const tw = Number(targetWidth);
      return { w: String(tw), h: String(Math.round(tw / ratio.decimal)) };
    }
    if (targetHeight) {
      const th = Number(targetHeight);
      return { w: String(Math.round(th * ratio.decimal)), h: String(th) };
    }
    return { w: "", h: "" };
  }, [targetWidth, targetHeight, ratio.decimal, lockRatio]);

  const applyRatio = (w: number, h: number) => {
    setWidth(w * 100);
    setHeight(h * 100);
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 14,
    fontFamily: "monospace",
    width: "100%",
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">Aspect Ratio Calculator</h1>
      <p className="tool-desc">
        Calculate aspect ratios, resize dimensions proportionally, and find common display ratios.
      </p>

      {/* Input dimensions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end", marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Width</span>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} style={inputStyle} />
        </label>
        <span style={{ fontSize: 20, fontWeight: 600, paddingBottom: 8, color: "var(--muted)" }}>x</span>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Height</span>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} style={inputStyle} />
        </label>
      </div>

      {/* Result */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
        padding: 16, marginBottom: 16, display: "flex", justifyContent: "space-around", textAlign: "center",
      }}>
        <div>
          <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>Aspect Ratio</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>{ratio.str}</div>
        </div>
        <div>
          <div style={{ color: "var(--muted)", fontSize: 12, marginBottom: 4 }}>Decimal</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>{ratio.decimal ? ratio.decimal.toFixed(4) : "—"}</div>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={() => copy(ratio.str)} style={{ fontSize: 12, marginTop: 8 }}>Copy Ratio</button>
        </div>
      </div>

      {/* Visual preview */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, padding: 16 }}>
        <div style={{
          width: Math.min(300, 300),
          height: Math.min(300, 300 / (ratio.decimal || 1)),
          maxHeight: 200,
          background: "var(--accent)",
          borderRadius: 8,
          opacity: 0.6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontFamily: "monospace",
          fontSize: 14,
        }}>
          {ratio.str}
        </div>
      </div>

      {/* Resize calculator */}
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Resize Calculator</h3>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
        <span style={{ color: "var(--muted)" }}>Lock aspect ratio</span>
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>New Width</span>
          <input type="number" value={targetWidth || resized.w} onChange={(e) => { setTargetWidth(e.target.value); setTargetHeight(""); }} placeholder="Enter width..." style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>New Height</span>
          <input type="number" value={targetHeight || resized.h} onChange={(e) => { setTargetHeight(e.target.value); setTargetWidth(""); }} placeholder="Enter height..." style={inputStyle} />
        </label>
      </div>

      {/* Common ratios */}
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Common Aspect Ratios</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, marginBottom: 16 }}>
        {COMMON_RATIOS.map((r) => (
          <button key={r.name} onClick={() => applyRatio(r.w, r.h)}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
              padding: "8px 12px", cursor: "pointer", textAlign: "left", color: "var(--foreground)",
            }}>
            <div style={{ fontWeight: 600, fontFamily: "monospace" }}>{r.name}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>{r.desc}</div>
          </button>
        ))}
      </div>

      <Toast />
    </main>
  );
}
