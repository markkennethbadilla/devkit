"use client";
import { useState, useMemo, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type GradientType = "linear" | "radial" | "conic";
type RadialShape = "circle" | "ellipse";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

let nextId = 3;

const PRESETS: { name: string; type: GradientType; angle: number; stops: Omit<ColorStop, "id">[] }[] = [
  { name: "Sunset", type: "linear", angle: 135, stops: [{ color: "#ff512f", position: 0 }, { color: "#f09819", position: 100 }] },
  { name: "Ocean", type: "linear", angle: 90, stops: [{ color: "#2193b0", position: 0 }, { color: "#6dd5ed", position: 100 }] },
  { name: "Purple Haze", type: "linear", angle: 135, stops: [{ color: "#7b4397", position: 0 }, { color: "#dc2430", position: 100 }] },
  { name: "Emerald", type: "linear", angle: 90, stops: [{ color: "#348f50", position: 0 }, { color: "#56b4d3", position: 100 }] },
  { name: "Midnight", type: "linear", angle: 180, stops: [{ color: "#232526", position: 0 }, { color: "#414345", position: 100 }] },
  { name: "Rainbow", type: "linear", angle: 90, stops: [{ color: "#ff0000", position: 0 }, { color: "#ff7700", position: 20 }, { color: "#ffff00", position: 40 }, { color: "#00ff00", position: 60 }, { color: "#0000ff", position: 80 }, { color: "#8b00ff", position: 100 }] },
  { name: "Radial Glow", type: "radial", angle: 0, stops: [{ color: "#ffffff", position: 0 }, { color: "#6a11cb", position: 100 }] },
  { name: "Conic Wheel", type: "conic", angle: 0, stops: [{ color: "#ff0000", position: 0 }, { color: "#ffff00", position: 25 }, { color: "#00ff00", position: 50 }, { color: "#0000ff", position: 75 }, { color: "#ff0000", position: 100 }] },
];

export default function GradientGeneratorPage() {
  const { copy, Toast } = useCopyToast();
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [radialShape, setRadialShape] = useState<RadialShape>("circle");
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 100 },
  ]);

  const gradientCSS = useMemo(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const colorStops = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (type === "linear") return `linear-gradient(${angle}deg, ${colorStops})`;
    if (type === "radial") return `radial-gradient(${radialShape}, ${colorStops})`;
    return `conic-gradient(from ${angle}deg, ${colorStops})`;
  }, [type, angle, radialShape, stops]);

  const fullCSS = `background: ${gradientCSS};`;

  const addStop = useCallback(() => {
    const pos = stops.length > 0 ? Math.min(100, stops[stops.length - 1].position + 10) : 50;
    setStops((prev) => [...prev, { id: nextId++, color: "#ffffff", position: pos }]);
  }, [stops]);

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStop = (id: number, field: keyof Omit<ColorStop, "id">, value: string | number) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const applyPreset = (preset: typeof PRESETS[number]) => {
    setType(preset.type);
    setAngle(preset.angle);
    setStops(preset.stops.map((s, i) => ({ ...s, id: nextId++ + i })));
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSS Gradient Generator</h1>
      <p className="tool-desc">
        Create beautiful CSS gradients with a visual editor. Supports linear, radial, and conic gradients.
      </p>

      {/* Preview */}
      <div
        style={{
          background: gradientCSS,
          height: 220,
          borderRadius: 12,
          border: "1px solid var(--border)",
          marginBottom: 24,
        }}
      />

      {/* Type selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
          <button
            key={t}
            className={type === t ? "btn" : "btn btn-secondary"}
            onClick={() => setType(t)}
            style={{ textTransform: "capitalize" }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Angle / Shape controls */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        {(type === "linear" || type === "conic") && (
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>
              {type === "linear" ? "Angle" : "Start angle"}
            </span>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              style={{ width: 160 }}
            />
            <span style={{ fontFamily: "monospace", minWidth: 48 }}>{angle}°</span>
          </label>
        )}
        {type === "radial" && (
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>Shape</span>
            <select
              value={radialShape}
              onChange={(e) => setRadialShape(e.target.value as RadialShape)}
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "4px 8px",
              }}
            >
              <option value="circle">Circle</option>
              <option value="ellipse">Ellipse</option>
            </select>
          </label>
        )}
      </div>

      {/* Color stops */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Color Stops</span>
          <button className="btn btn-secondary" onClick={addStop} style={{ fontSize: 13 }}>
            + Add Stop
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {stops.map((stop) => (
            <div
              key={stop.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--surface)",
                borderRadius: 8,
                padding: "8px 12px",
                border: "1px solid var(--border)",
              }}
            >
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                style={{ width: 36, height: 36, border: "none", borderRadius: 6, cursor: "pointer", padding: 0 }}
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  background: "var(--background)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  width: 90,
                }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={stop.position}
                onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                style={{ flex: 1, minWidth: 80 }}
              />
              <span style={{ fontFamily: "monospace", fontSize: 13, minWidth: 38 }}>{stop.position}%</span>
              {stops.length > 2 && (
                <button
                  onClick={() => removeStop(stop.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: 18,
                    padding: "0 4px",
                  }}
                  title="Remove stop"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 600, display: "block", marginBottom: 8 }}>Presets</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                border: "1px solid var(--border)",
                cursor: "pointer",
                background:
                  p.type === "linear"
                    ? `linear-gradient(${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
                    : p.type === "radial"
                    ? `radial-gradient(circle, ${p.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`
                    : `conic-gradient(from ${p.angle}deg, ${p.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`,
              }}
              title={p.name}
            />
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border)",
          padding: 16,
          fontFamily: "monospace",
          fontSize: 13,
          wordBreak: "break-all",
          marginBottom: 12,
        }}
      >
        {fullCSS}
      </div>

      <button className="btn" onClick={() => copy(fullCSS)}>
        Copy CSS
      </button>

      <Toast />
    </main>
  );
}
