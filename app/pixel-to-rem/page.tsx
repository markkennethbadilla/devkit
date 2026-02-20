"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const COMMON_SIZES = [8, 10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

type Unit = "px" | "rem" | "em";

export default function PixelToRemPage() {
  const { copy, Toast } = useCopyToast();
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState<Unit>("px");
  const [baseFontSize, setBaseFontSize] = useState(16);

  const conversions = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || baseFontSize <= 0) return null;

    let px: number;
    if (fromUnit === "px") px = v;
    else px = v * baseFontSize; // rem and em both relative to base

    const rem = px / baseFontSize;
    const em = rem; // at root level, em === rem
    const pt = px * 0.75;
    const percent = (px / baseFontSize) * 100;

    return { px, rem, em, pt, percent };
  }, [value, fromUnit, baseFontSize]);

  const table = useMemo(() => {
    return COMMON_SIZES.map((px) => ({
      px,
      rem: (px / baseFontSize).toFixed(4).replace(/\.?0+$/, ""),
      em: (px / baseFontSize).toFixed(4).replace(/\.?0+$/, ""),
      pt: (px * 0.75).toFixed(1).replace(/\.?0+$/, ""),
    }));
  }, [baseFontSize]);

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
    borderRadius: 6, padding: "8px 10px", fontSize: 14, fontFamily: "monospace", width: "100%",
  };

  const unitSelect = (val: Unit, onChange: (v: Unit) => void) => (
    <select value={val} onChange={(e) => onChange(e.target.value as Unit)} style={{ ...inputStyle, width: 80 }}>
      <option value="px">px</option>
      <option value="rem">rem</option>
      <option value="em">em</option>
    </select>
  );

  const fmt = (n: number) => {
    const s = n.toFixed(4);
    return s.replace(/\.?0+$/, "") || "0";
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">PX to REM Converter</h1>
      <p className="tool-desc">Convert between CSS px, rem, and em units with a custom base font size.</p>

      <div style={{ display: "flex", gap: 12, alignItems: "end", marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, flex: 1, minWidth: 120 }}>
          <span style={{ color: "var(--muted)" }}>Value</span>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={inputStyle} />
            {unitSelect(fromUnit, setFromUnit)}
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13, width: 140 }}>
          <span style={{ color: "var(--muted)" }}>Base Font Size (px)</span>
          <input type="number" value={baseFontSize} onChange={(e) => setBaseFontSize(Number(e.target.value) || 16)} style={inputStyle} />
        </label>
      </div>

      {/* Results */}
      {conversions && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 8, marginBottom: 24,
        }}>
          {([
            { label: "Pixels", value: conversions.px, unit: "px" },
            { label: "REM", value: conversions.rem, unit: "rem" },
            { label: "EM", value: conversions.em, unit: "em" },
            { label: "Points", value: conversions.pt, unit: "pt" },
            { label: "Percent", value: conversions.percent, unit: "%" },
          ]).map((c) => (
            <div key={c.label} style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
              padding: "10px 14px", cursor: "pointer",
            }} onClick={() => copy(`${fmt(c.value)}${c.unit}`)}>
              <div style={{ color: "var(--muted)", fontSize: 11 }}>{c.label}</div>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18 }}>
                {fmt(c.value)}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--muted)" }}>{c.unit}</span>
              </div>
              <div style={{ color: "var(--muted)", fontSize: 10, marginTop: 2 }}>click to copy</div>
            </div>
          ))}
        </div>
      )}

      {/* Conversion Table */}
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Conversion Table (base: {baseFontSize}px)</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "monospace" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              {["px", "rem", "em", "pt"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "var(--muted)", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row) => (
              <tr key={row.px} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "6px 12px" }}>{row.px}px</td>
                <td style={{ padding: "6px 12px", cursor: "pointer" }} onClick={() => copy(`${row.rem}rem`)}>{row.rem}rem</td>
                <td style={{ padding: "6px 12px", cursor: "pointer" }} onClick={() => copy(`${row.em}em`)}>{row.em}em</td>
                <td style={{ padding: "6px 12px" }}>{row.pt}pt</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toast />
    </main>
  );
}
