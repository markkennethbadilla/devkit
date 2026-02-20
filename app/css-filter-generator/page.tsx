"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface FilterDef {
  name: string;
  property: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

const FILTERS: FilterDef[] = [
  { name: "Blur", property: "blur", unit: "px", min: 0, max: 20, step: 0.5, default: 0 },
  { name: "Brightness", property: "brightness", unit: "%", min: 0, max: 300, step: 5, default: 100 },
  { name: "Contrast", property: "contrast", unit: "%", min: 0, max: 300, step: 5, default: 100 },
  { name: "Grayscale", property: "grayscale", unit: "%", min: 0, max: 100, step: 5, default: 0 },
  { name: "Hue Rotate", property: "hue-rotate", unit: "deg", min: 0, max: 360, step: 5, default: 0 },
  { name: "Invert", property: "invert", unit: "%", min: 0, max: 100, step: 5, default: 0 },
  { name: "Opacity", property: "opacity", unit: "%", min: 0, max: 100, step: 5, default: 100 },
  { name: "Saturate", property: "saturate", unit: "%", min: 0, max: 300, step: 5, default: 100 },
  { name: "Sepia", property: "sepia", unit: "%", min: 0, max: 100, step: 5, default: 0 },
  { name: "Drop Shadow X", property: "drop-shadow-x", unit: "px", min: -20, max: 20, step: 1, default: 0 },
  { name: "Drop Shadow Y", property: "drop-shadow-y", unit: "px", min: -20, max: 20, step: 1, default: 0 },
  { name: "Drop Shadow Blur", property: "drop-shadow-blur", unit: "px", min: 0, max: 20, step: 1, default: 0 },
];

interface Preset {
  name: string;
  values: Record<string, number>;
}

const PRESETS: Preset[] = [
  { name: "None", values: {} },
  { name: "Grayscale", values: { grayscale: 100 } },
  { name: "Sepia Vintage", values: { sepia: 80, brightness: 110, contrast: 90 } },
  { name: "High Contrast", values: { contrast: 200, brightness: 110 } },
  { name: "Warm", values: { "hue-rotate": 30, saturate: 140, brightness: 105 } },
  { name: "Cool", values: { "hue-rotate": 180, saturate: 80, brightness: 105 } },
  { name: "Dreamy", values: { blur: 2, brightness: 120, saturate: 130 } },
  { name: "Dark", values: { brightness: 60, contrast: 150 } },
  { name: "Inverted", values: { invert: 100 } },
];

export default function CssFilterGeneratorPage() {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const f of FILTERS) {
      initial[f.property] = f.default;
    }
    return initial;
  });
  const [shadowColor, setShadowColor] = useState("#000000");
  const { copy, Toast } = useCopyToast();

  const filterString = useMemo(() => {
    const parts: string[] = [];
    for (const f of FILTERS) {
      if (f.property.startsWith("drop-shadow")) continue;
      const val = values[f.property] ?? f.default;
      if (val !== f.default) {
        if (f.unit === "px") {
          parts.push(`${f.property}(${val}px)`);
        } else if (f.unit === "deg") {
          parts.push(`${f.property}(${val}deg)`);
        } else {
          parts.push(`${f.property}(${val}%)`);
        }
      }
    }
    // Drop shadow
    const sx = values["drop-shadow-x"] ?? 0;
    const sy = values["drop-shadow-y"] ?? 0;
    const sb = values["drop-shadow-blur"] ?? 0;
    if (sx !== 0 || sy !== 0 || sb !== 0) {
      parts.push(`drop-shadow(${sx}px ${sy}px ${sb}px ${shadowColor})`);
    }
    return parts.length > 0 ? parts.join(" ") : "none";
  }, [values, shadowColor]);

  const cssCode = `filter: ${filterString};`;

  const setValue = (prop: string, val: number) => {
    setValues((prev) => ({ ...prev, [prop]: val }));
  };

  const applyPreset = (preset: Preset) => {
    const newVals: Record<string, number> = {};
    for (const f of FILTERS) {
      newVals[f.property] = f.default;
    }
    for (const [k, v] of Object.entries(preset.values)) {
      newVals[k] = v;
    }
    setValues(newVals);
  };

  const resetAll = () => {
    const initial: Record<string, number> = {};
    for (const f of FILTERS) {
      initial[f.property] = f.default;
    }
    setValues(initial);
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        CSS Filter Generator
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Build CSS filter effects visually. Adjust sliders and see live preview.
      </p>

      {/* Presets */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            className="btn-secondary"
            onClick={() => applyPreset(p)}
            style={{ fontSize: "0.78rem", padding: "3px 10px" }}
          >
            {p.name}
          </button>
        ))}
        <button
          className="btn-secondary"
          onClick={resetAll}
          style={{ fontSize: "0.78rem", padding: "3px 10px" }}
        >
          Reset
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FILTERS.map((f) => (
            <div key={f.property}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.82rem",
                  marginBottom: 2,
                }}
              >
                <span>{f.name}</span>
                <span style={{ fontFamily: "monospace", color: "var(--muted)" }}>
                  {values[f.property] ?? f.default}
                  {f.unit}
                </span>
              </div>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={values[f.property] ?? f.default}
                onChange={(e) => setValue(f.property, Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>
          ))}
          <div>
            <div style={{ fontSize: "0.82rem", marginBottom: 4 }}>Shadow Color</div>
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
              style={{ width: 40, height: 30, border: "none", cursor: "pointer", borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <div
            style={{
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 8 }}>
              Preview
            </div>
            <div
              style={{
                width: "100%",
                height: 240,
                borderRadius: 8,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                filter: filterString,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              Preview Image
            </div>
          </div>

          {/* CSS Output */}
          <div
            style={{
              padding: "0.8rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>CSS</span>
              <button
                className="btn"
                onClick={() => copy(cssCode)}
                style={{ fontSize: "0.72rem", padding: "2px 8px" }}
              >
                Copy
              </button>
            </div>
            <code
              style={{
                fontFamily: "monospace",
                fontSize: "0.82rem",
                wordBreak: "break-all",
                color: "var(--accent)",
              }}
            >
              {cssCode}
            </code>
          </div>
        </div>
      </div>

      <Toast />
    </main>
  );
}
