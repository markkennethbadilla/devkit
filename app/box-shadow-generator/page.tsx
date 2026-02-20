"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function shadowToCSS(s: Shadow): string {
  const color = hexToRgba(s.color, s.opacity);
  return `${s.inset ? "inset " : ""}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${color}`;
}

const PRESETS: { name: string; shadows: Omit<Shadow, "id">[] }[] = [
  {
    name: "Subtle",
    shadows: [{ offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: "#000000", opacity: 0.12, inset: false }],
  },
  {
    name: "Medium",
    shadows: [
      { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: "#000000", opacity: 0.1, inset: false },
      { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Large",
    shadows: [
      { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: "#000000", opacity: 0.1, inset: false },
      { offsetX: 0, offsetY: 4, blur: 6, spread: -4, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Elevated",
    shadows: [
      { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: "#000000", opacity: 0.1, inset: false },
      { offsetX: 0, offsetY: 8, blur: 10, spread: -6, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Sharp",
    shadows: [{ offsetX: 4, offsetY: 4, blur: 0, spread: 0, color: "#000000", opacity: 0.25, inset: false }],
  },
  {
    name: "Glow",
    shadows: [{ offsetX: 0, offsetY: 0, blur: 20, spread: 2, color: "#3b82f6", opacity: 0.5, inset: false }],
  },
  {
    name: "Inset",
    shadows: [{ offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: "#000000", opacity: 0.2, inset: true }],
  },
  {
    name: "Layered",
    shadows: [
      { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: "#000000", opacity: 0.05, inset: false },
      { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: "#000000", opacity: 0.05, inset: false },
      { offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: "#000000", opacity: 0.05, inset: false },
      { offsetX: 0, offsetY: 8, blur: 16, spread: 0, color: "#000000", opacity: 0.05, inset: false },
    ],
  },
];

let nextId = 1;

export default function BoxShadowGeneratorPage() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: nextId++, offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: "#000000", opacity: 0.1, inset: false },
    { id: nextId++, offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: "#000000", opacity: 0.1, inset: false },
  ]);
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#f1f5f9");
  const [borderRadius, setBorderRadius] = useState(8);
  const { copy, Toast } = useCopyToast();

  const cssValue = shadows.map(shadowToCSS).join(",\n    ");
  const fullCSS = `box-shadow: ${cssValue};`;

  const updateShadow = (id: number, key: keyof Shadow, value: number | string | boolean) => {
    setShadows((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: value } : s))
    );
  };

  const removeShadow = (id: number) => {
    setShadows((prev) => prev.filter((s) => s.id !== id));
  };

  const addShadow = () => {
    setShadows((prev) => [
      ...prev,
      { id: nextId++, offsetX: 0, offsetY: 4, blur: 8, spread: 0, color: "#000000", opacity: 0.15, inset: false },
    ]);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setShadows(preset.shadows.map((s) => ({ ...s, id: nextId++ })));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">CSS Box Shadow Generator</h1>
      <p className="text-[var(--muted)] mb-6">
        Create CSS box shadows visually. Add multiple layers, customize each
        one, and copy the CSS.
      </p>

      {/* Preview */}
      <div
        className="flex items-center justify-center mb-6 rounded-lg"
        style={{
          background: bgColor,
          padding: "4rem 2rem",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: 200,
            height: 200,
            background: boxColor,
            borderRadius,
            boxShadow: shadows.map(shadowToCSS).join(", "),
            transition: "box-shadow 0.2s, border-radius 0.2s",
          }}
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            style={{
              padding: "0.35rem 0.7rem",
              fontSize: "0.8rem",
              background: "var(--surface)",
              color: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Global controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Box:</span>
          <input
            type="color"
            value={boxColor}
            onChange={(e) => setBoxColor(e.target.value)}
            className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Background:</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-8 h-8 rounded border border-[var(--border)] cursor-pointer"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Radius:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={borderRadius}
            onChange={(e) => setBorderRadius(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-xs text-[var(--muted)]">{borderRadius}px</span>
        </label>
      </div>

      {/* Shadow layers */}
      <div className="space-y-3 mb-4">
        {shadows.map((s, i) => (
          <div
            key={s.id}
            style={{
              padding: "0.75rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">
                Layer {i + 1}
                {s.inset && " (inset)"}
              </span>
              <button
                onClick={() => removeShadow(s.id)}
                style={{
                  fontSize: "0.75rem",
                  color: "#ef4444",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(
                [
                  ["offsetX", "X Offset", -50, 50],
                  ["offsetY", "Y Offset", -50, 50],
                  ["blur", "Blur", 0, 100],
                  ["spread", "Spread", -50, 50],
                ] as const
              ).map(([key, label, min, max]) => (
                <label key={key} className="flex flex-col gap-1">
                  <span className="text-xs text-[var(--muted)]">
                    {label}: {s[key]}px
                  </span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={s[key]}
                    onChange={(e) => updateShadow(s.id, key, parseInt(e.target.value))}
                  />
                </label>
              ))}

              <label className="flex flex-col gap-1">
                <span className="text-xs text-[var(--muted)]">
                  Opacity: {Math.round(s.opacity * 100)}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(s.opacity * 100)}
                  onChange={(e) => updateShadow(s.id, "opacity", parseInt(e.target.value) / 100)}
                />
              </label>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1">
                  <span className="text-xs text-[var(--muted)]">Color:</span>
                  <input
                    type="color"
                    value={s.color}
                    onChange={(e) => updateShadow(s.id, "color", e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.inset}
                    onChange={(e) => updateShadow(s.id, "inset", e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  <span className="text-xs">Inset</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-secondary mb-6" onClick={addShadow}>
        + Add Shadow Layer
      </button>

      {/* CSS output */}
      <div
        onClick={() => copy(fullCSS)}
        className="cursor-pointer hover:border-[var(--accent)] transition-colors"
        style={{
          padding: "1rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          color: "var(--foreground)",
          whiteSpace: "pre-wrap",
        }}
        title="Click to copy"
      >
        {fullCSS}
      </div>

      <Toast />
    </div>
  );
}
