"use client";
import { useState, useEffect } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255)];
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const { copy, Toast } = useCopyToast();

  const updateFromHex = (val: string) => {
    setHex(val);
    const c = hexToRgb(val);
    if (c) {
      setRgb({ r: c[0], g: c[1], b: c[2] });
      const [h, s, l] = rgbToHsl(c[0], c[1], c[2]);
      setHsl({ h, s, l });
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    const [h, s, l] = rgbToHsl(r, g, b);
    setHsl({ h, s, l });
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const [r, g, b] = hslToRgb(h, s, l);
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Color Converter</h1>
      <p className="text-[var(--muted)] mb-6">Convert between HEX, RGB, and HSL color formats. See a live preview.</p>

      <div className="w-full h-24 rounded-xl mb-6 border border-[var(--border)]" style={{ backgroundColor: hex }} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-[var(--accent)]">HEX</label>
            <button onClick={() => copy(hex)} className="text-xs text-[var(--accent)] hover:underline">Copy</button>
          </div>
          <input type="text" value={hex} onChange={(e) => updateFromHex(e.target.value)} />
        </div>
        <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-[var(--accent)]">RGB</label>
            <button onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="text-xs text-[var(--accent)] hover:underline">Copy</button>
          </div>
          <div className="flex gap-2">
            <input type="number" value={rgb.r} onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)} min={0} max={255} className="!w-full" placeholder="R" />
            <input type="number" value={rgb.g} onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)} min={0} max={255} className="!w-full" placeholder="G" />
            <input type="number" value={rgb.b} onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))} min={0} max={255} className="!w-full" placeholder="B" />
          </div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-[var(--accent)]">HSL</label>
            <button onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="text-xs text-[var(--accent)] hover:underline">Copy</button>
          </div>
          <div className="flex gap-2">
            <input type="number" value={hsl.h} onChange={(e) => updateFromHsl(Number(e.target.value), hsl.s, hsl.l)} min={0} max={360} className="!w-full" placeholder="H" />
            <input type="number" value={hsl.s} onChange={(e) => updateFromHsl(hsl.h, Number(e.target.value), hsl.l)} min={0} max={100} className="!w-full" placeholder="S" />
            <input type="number" value={hsl.l} onChange={(e) => updateFromHsl(hsl.h, hsl.s, Number(e.target.value))} min={0} max={100} className="!w-full" placeholder="L" />
          </div>
        </div>
      </div>
      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About Color Formats</h2>
        <p>HEX is the most common web color format (#RRGGBB). RGB represents colors as red, green, blue values (0-255). HSL uses hue (0-360°), saturation (0-100%), and lightness (0-100%), which is often more intuitive for designers.</p>
      </section>
      <Toast />
    </div>
  );
}
