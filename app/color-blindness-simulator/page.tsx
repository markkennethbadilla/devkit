"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// Color vision deficiency simulation matrices
// Based on Machado, Oliveira & Fernandes (2009) model
interface SimType {
  name: string;
  label: string;
  desc: string;
  matrix: number[][];
}

const SIM_TYPES: SimType[] = [
  {
    name: "normal",
    label: "Normal Vision",
    desc: "Trichromatic — full color vision",
    matrix: [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
  },
  {
    name: "protanopia",
    label: "Protanopia",
    desc: "No red cones (~1% of males)",
    matrix: [
      [0.567, 0.433, 0],
      [0.558, 0.442, 0],
      [0, 0.242, 0.758],
    ],
  },
  {
    name: "deuteranopia",
    label: "Deuteranopia",
    desc: "No green cones (~1% of males)",
    matrix: [
      [0.625, 0.375, 0],
      [0.7, 0.3, 0],
      [0, 0.3, 0.7],
    ],
  },
  {
    name: "tritanopia",
    label: "Tritanopia",
    desc: "No blue cones (very rare)",
    matrix: [
      [0.95, 0.05, 0],
      [0, 0.433, 0.567],
      [0, 0.475, 0.525],
    ],
  },
  {
    name: "achromatopsia",
    label: "Achromatopsia",
    desc: "Complete color blindness (monochromacy)",
    matrix: [
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
      [0.299, 0.587, 0.114],
    ],
  },
  {
    name: "protanomaly",
    label: "Protanomaly",
    desc: "Weak red cones (~1% of males)",
    matrix: [
      [0.817, 0.183, 0],
      [0.333, 0.667, 0],
      [0, 0.125, 0.875],
    ],
  },
  {
    name: "deuteranomaly",
    label: "Deuteranomaly",
    desc: "Weak green cones (~5% of males)",
    matrix: [
      [0.8, 0.2, 0],
      [0.258, 0.742, 0],
      [0, 0.142, 0.858],
    ],
  },
  {
    name: "tritanomaly",
    label: "Tritanomaly",
    desc: "Weak blue cones (very rare)",
    matrix: [
      [0.967, 0.033, 0],
      [0, 0.733, 0.267],
      [0, 0.183, 0.817],
    ],
  },
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

function simulateColor(hex: string, matrix: number[][]): string {
  const [r, g, b] = hexToRgb(hex);
  const nr = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b;
  const ng = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b;
  const nb = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b;
  return rgbToHex(nr, ng, nb);
}

const DEFAULT_PALETTE = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22", "#34495e"];

export default function ColorBlindnessSimulatorPage() {
  const [colors, setColors] = useState<string[]>(DEFAULT_PALETTE);
  const [newColor, setNewColor] = useState("#e74c3c");
  const { copy, Toast } = useCopyToast();

  const simulations = useMemo(() => {
    return SIM_TYPES.map((sim) => ({
      ...sim,
      simulated: colors.map((c) => simulateColor(c, sim.matrix)),
    }));
  }, [colors]);

  const addColor = () => {
    if (!colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const removeColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        Color Blindness Simulator
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        See how your color palette looks to people with different types of color vision deficiency.
      </p>

      {/* Color palette input */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          style={{ width: 40, height: 34, border: "none", cursor: "pointer", borderRadius: 4 }}
        />
        <input
          type="text"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          style={{
            width: 90,
            padding: "6px 10px",
            fontFamily: "monospace",
            fontSize: "0.85rem",
            border: "1px solid var(--border)",
            borderRadius: 6,
            background: "var(--surface)",
            color: "var(--foreground)",
          }}
        />
        <button className="btn" onClick={addColor}>
          Add Color
        </button>
        <button className="btn-secondary" onClick={() => setColors(DEFAULT_PALETTE)}>
          Reset
        </button>
        <button className="btn-secondary" onClick={() => setColors([])}>
          Clear All
        </button>
      </div>

      {/* Current palette */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
        {colors.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: c,
                border: "1px solid var(--border)",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => copy(c)}
              title={`Click to copy ${c}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeColor(i);
                }}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--foreground)",
                  color: "var(--background)",
                  border: "none",
                  fontSize: "0.65rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                x
              </button>
            </div>
            <span style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "monospace" }}>
              {c}
            </span>
          </div>
        ))}
        {colors.length === 0 && (
          <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
            Add colors to simulate
          </span>
        )}
      </div>

      {/* Simulation results */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {simulations.map((sim) => (
          <div
            key={sim.name}
            style={{
              padding: "0.8rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <strong style={{ fontSize: "0.9rem" }}>{sim.label}</strong>
              <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{sim.desc}</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sim.simulated.map((c, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: c,
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                    }}
                    onClick={() => copy(c)}
                    title={`${colors[i]} → ${c}`}
                  />
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--muted)",
                      fontFamily: "monospace",
                    }}
                  >
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Toast />
    </main>
  );
}
