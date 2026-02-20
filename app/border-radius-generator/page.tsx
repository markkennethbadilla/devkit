"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const PRESETS = [
  { name: "None", tl: 0, tr: 0, br: 0, bl: 0 },
  { name: "Rounded", tl: 8, tr: 8, br: 8, bl: 8 },
  { name: "Pill", tl: 9999, tr: 9999, br: 9999, bl: 9999 },
  { name: "Top Only", tl: 16, tr: 16, br: 0, bl: 0 },
  { name: "Bottom Only", tl: 0, tr: 0, br: 16, bl: 16 },
  { name: "Left Only", tl: 16, tr: 0, br: 0, bl: 16 },
  { name: "Diagonal", tl: 32, tr: 0, br: 32, bl: 0 },
  { name: "Drop", tl: 50, tr: 50, br: 50, bl: 0 },
];

export default function BorderRadiusGeneratorPage() {
  const { copy, Toast } = useCopyToast();

  const [tl, setTl] = useState(8);
  const [tr, setTr] = useState(8);
  const [br, setBr] = useState(8);
  const [bl, setBl] = useState(8);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<"px" | "%" | "em" | "rem">("px");
  const [bgColor, setBgColor] = useState("#6366f1");
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [boxWidth, setBoxWidth] = useState(200);
  const [boxHeight, setBoxHeight] = useState(200);

  const setAll = (val: number) => {
    setTl(val);
    setTr(val);
    setBr(val);
    setBl(val);
  };

  const handleChange = (corner: "tl" | "tr" | "br" | "bl", val: number) => {
    if (linked) {
      setAll(val);
    } else {
      if (corner === "tl") setTl(val);
      else if (corner === "tr") setTr(val);
      else if (corner === "br") setBr(val);
      else setBl(val);
    }
  };

  const applyPreset = (p: typeof PRESETS[number]) => {
    setTl(p.tl);
    setTr(p.tr);
    setBr(p.br);
    setBl(p.bl);
    setLinked(false);
  };

  const radiusValue = useMemo(() => {
    if (tl === tr && tr === br && br === bl) return `${tl}${unit}`;
    return `${tl}${unit} ${tr}${unit} ${br}${unit} ${bl}${unit}`;
  }, [tl, tr, br, bl, unit]);

  const cssLines = useMemo(() => {
    const lines = [`border-radius: ${radiusValue};`];
    if (borderWidth > 0) {
      lines.push(`border: ${borderWidth}px solid ${borderColor};`);
    }
    return lines.join("\n");
  }, [radiusValue, borderWidth, borderColor]);

  const sliderRow = (label: string, corner: "tl" | "tr" | "br" | "bl", value: number) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <span style={{ color: "var(--muted)", minWidth: 90 }}>{label}</span>
      <input type="range" min={0} max={200} value={value} onChange={(e) => handleChange(corner, Number(e.target.value))} style={{ flex: 1 }} />
      <span style={{ fontFamily: "monospace", minWidth: 50 }}>{value}{unit}</span>
    </label>
  );

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSS Border Radius Generator</h1>
      <p className="tool-desc">
        Visually create CSS border-radius values. Adjust individual corners or link them together.
      </p>

      {/* Preview */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div
          style={{
            width: boxWidth,
            height: boxHeight,
            background: bgColor,
            borderRadius: radiusValue,
            border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : "none",
            transition: "border-radius 0.15s, background 0.15s",
          }}
        />
      </div>

      {/* Presets */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {PRESETS.map((p) => (
          <button key={p.name} className="btn btn-secondary" onClick={() => applyPreset(p)} style={{ fontSize: 12 }}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Link toggle + unit */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} />
          <span style={{ color: "var(--muted)" }}>Link all corners</span>
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Unit</span>
          <select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)}
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px" }}>
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="em">em</option>
            <option value="rem">rem</option>
          </select>
        </label>
      </div>

      {/* Corner sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {sliderRow("Top Left", "tl", tl)}
        {sliderRow("Top Right", "tr", tr)}
        {sliderRow("Bottom Right", "br", br)}
        {sliderRow("Bottom Left", "bl", bl)}
      </div>

      {/* Additional options */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Background</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 4, cursor: "pointer", padding: 0 }} />
            <span style={{ fontFamily: "monospace", fontSize: 12 }}>{bgColor}</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Border Width</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="range" min={0} max={10} value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "monospace", minWidth: 30 }}>{borderWidth}px</span>
          </div>
        </label>
        {borderWidth > 0 && (
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>Border Color</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 4, cursor: "pointer", padding: 0 }} />
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>{borderColor}</span>
            </div>
          </label>
        )}
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Box Width</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="range" min={50} max={400} value={boxWidth} onChange={(e) => setBoxWidth(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "monospace", minWidth: 36 }}>{boxWidth}px</span>
          </div>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Box Height</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="range" min={50} max={400} value={boxHeight} onChange={(e) => setBoxHeight(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontFamily: "monospace", minWidth: 36 }}>{boxHeight}px</span>
          </div>
        </label>
      </div>

      {/* CSS output */}
      <div style={{
        background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)",
        padding: 16, fontFamily: "monospace", fontSize: 13, whiteSpace: "pre", marginBottom: 12,
      }}>
        {cssLines}
      </div>

      <button className="btn" onClick={() => copy(cssLines)}>Copy CSS</button>
      <Toast />
    </main>
  );
}
