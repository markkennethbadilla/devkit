"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type Scheme = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic" | "monochromatic";

function hexToHSL(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hslToRGB(h: number, s: number, l: number): string {
  const hex = hslToHex(h, s, l);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function generateScheme(h: number, s: number, l: number, scheme: Scheme): [number, number, number][] {
  switch (scheme) {
    case "complementary":
      return [[h, s, l], [h + 180, s, l]];
    case "analogous":
      return [[h - 30, s, l], [h, s, l], [h + 30, s, l]];
    case "triadic":
      return [[h, s, l], [h + 120, s, l], [h + 240, s, l]];
    case "split-complementary":
      return [[h, s, l], [h + 150, s, l], [h + 210, s, l]];
    case "tetradic":
      return [[h, s, l], [h + 90, s, l], [h + 180, s, l], [h + 270, s, l]];
    case "monochromatic":
      return [
        [h, s, Math.max(10, l - 30)],
        [h, s, Math.max(10, l - 15)],
        [h, s, l],
        [h, s, Math.min(90, l + 15)],
        [h, s, Math.min(90, l + 30)],
      ];
  }
}

const SCHEMES: { value: Scheme; label: string }[] = [
  { value: "complementary", label: "Complementary" },
  { value: "analogous", label: "Analogous" },
  { value: "triadic", label: "Triadic" },
  { value: "split-complementary", label: "Split Complementary" },
  { value: "tetradic", label: "Tetradic (Square)" },
  { value: "monochromatic", label: "Monochromatic" },
];

export default function ColorPaletteGeneratorPage() {
  const { copy, Toast } = useCopyToast();
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [scheme, setScheme] = useState<Scheme>("analogous");
  const [format, setFormat] = useState<"hex" | "rgb" | "hsl">("hex");

  const [h, s, l] = useMemo(() => hexToHSL(baseColor), [baseColor]);

  const colors = useMemo(() => {
    return generateScheme(h, s, l, scheme).map(([ch, cs, cl]) => ({
      hex: hslToHex(ch, cs, cl),
      rgb: hslToRGB(ch, cs, cl),
      hsl: `hsl(${((ch % 360) + 360) % 360}, ${cs}%, ${cl}%)`,
      h: ch, s: cs, l: cl,
    }));
  }, [h, s, l, scheme]);

  const getDisplayValue = (c: typeof colors[0]) => {
    if (format === "hex") return c.hex;
    if (format === "rgb") return c.rgb;
    return c.hsl;
  };

  const allValues = colors.map(getDisplayValue).join("\n");

  const cssVars = colors.map((c, i) => `  --color-${i + 1}: ${getDisplayValue(c)};`).join("\n");
  const cssBlock = `:root {\n${cssVars}\n}`;

  return (
    <main className="tool-container">
      <h1 className="tool-title">Color Palette Generator</h1>
      <p className="tool-desc">
        Generate harmonious color palettes from a base color using color theory schemes.
      </p>

      {/* Base color picker */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--muted)", fontSize: 13 }}>Base Color</span>
          <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)}
            style={{ width: 48, height: 48, border: "none", borderRadius: 8, cursor: "pointer", padding: 0 }} />
          <input type="text" value={baseColor} onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBaseColor(e.target.value); }}
            style={{ fontFamily: "monospace", fontSize: 14, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", width: 90 }} />
        </label>
      </div>

      {/* Scheme + Format */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Color Scheme</span>
          <select value={scheme} onChange={(e) => setScheme(e.target.value as Scheme)}
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px" }}>
            {SCHEMES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>Format</span>
          <select value={format} onChange={(e) => setFormat(e.target.value as typeof format)}
            style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px" }}>
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
            <option value="hsl">HSL</option>
          </select>
        </label>
      </div>

      {/* Color palette display */}
      <div style={{ display: "flex", gap: 0, borderRadius: 12, overflow: "hidden", marginBottom: 16, border: "1px solid var(--border)" }}>
        {colors.map((c, i) => (
          <div key={i} onClick={() => copy(getDisplayValue(c))}
            style={{
              flex: 1,
              minHeight: 120,
              background: c.hex,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 8,
              cursor: "pointer",
              transition: "transform 0.1s",
            }}
            title={`Click to copy ${getDisplayValue(c)}`}
          >
            <span style={{
              fontSize: 11,
              fontFamily: "monospace",
              color: c.l > 60 ? "#000" : "#fff",
              background: c.l > 60 ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.3)",
              borderRadius: 4,
              padding: "2px 4px",
              textAlign: "center",
            }}>
              {getDisplayValue(c)}
            </span>
          </div>
        ))}
      </div>

      {/* Color details */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(colors.length, 5)}, 1fr)`, gap: 8, marginBottom: 16 }}>
        {colors.map((c, i) => (
          <div key={i} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 10, fontSize: 12, fontFamily: "monospace" }}>
            <div style={{ width: "100%", height: 24, background: c.hex, borderRadius: 4, marginBottom: 6 }} />
            <div>{c.hex}</div>
            <div style={{ color: "var(--muted)" }}>{c.rgb}</div>
            <div style={{ color: "var(--muted)" }}>{c.hsl}</div>
          </div>
        ))}
      </div>

      {/* CSS Variables */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>CSS Variables</span>
      </div>
      <div style={{
        background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)",
        padding: 16, fontFamily: "monospace", fontSize: 13, whiteSpace: "pre", marginBottom: 12,
      }}>
        {cssBlock}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn" onClick={() => copy(cssBlock)}>Copy CSS Variables</button>
        <button className="btn btn-secondary" onClick={() => copy(allValues)}>Copy All Values</button>
      </div>

      <Toast />
    </main>
  );
}
