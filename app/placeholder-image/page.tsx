"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export default function PlaceholderImagePage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [txtColor, setTxtColor] = useState("#666666");
  const [label, setLabel] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    const text = label || `${width} x ${height}`;
    const fontSize = Math.max(14, Math.min(width, height) / 8);
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = txtColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2, width * 0.9);
  }, [width, height, bgColor, txtColor, label]);

  useEffect(() => { draw(); }, [draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `placeholder-${width}x${height}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const PRESETS = [
    [1200, 630, "OG Image"], [800, 600, "4:3"], [1920, 1080, "HD"],
    [300, 250, "Ad Banner"], [728, 90, "Leaderboard"], [160, 600, "Skyscraper"],
    [512, 512, "Square"], [150, 150, "Thumbnail"], [1024, 768, "XGA"],
  ] as const;

  return (
    <main className="tool-container">
      <h1 className="tool-title">Placeholder Image Generator</h1>
      <p className="tool-desc">Generate placeholder images with custom size, colors, and text. Download as PNG.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
        <label style={{ fontSize: 13 }}>
          Width (px)
          <input type="number" min={1} max={4096} value={width} onChange={(e) => setWidth(Math.max(1, +e.target.value || 1))}
            style={{ width: "100%", marginTop: 4, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px" }} />
        </label>
        <label style={{ fontSize: 13 }}>
          Height (px)
          <input type="number" min={1} max={4096} value={height} onChange={(e) => setHeight(Math.max(1, +e.target.value || 1))}
            style={{ width: "100%", marginTop: 4, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px" }} />
        </label>
        <label style={{ fontSize: 13 }}>
          Background
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: 40, height: 34, border: "none", cursor: "pointer" }} />
            <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
              style={{ flex: 1, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px" }} />
          </div>
        </label>
        <label style={{ fontSize: 13 }}>
          Text Color
          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <input type="color" value={txtColor} onChange={(e) => setTxtColor(e.target.value)} style={{ width: 40, height: 34, border: "none", cursor: "pointer" }} />
            <input type="text" value={txtColor} onChange={(e) => setTxtColor(e.target.value)}
              style={{ flex: 1, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px" }} />
          </div>
        </label>
      </div>

      <label style={{ fontSize: 13, display: "block", marginBottom: 16 }}>
        Custom Label (leave empty for &quot;W x H&quot;)
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder={`${width} x ${height}`}
          style={{ width: "100%", marginTop: 4, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 8px" }} />
      </label>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Presets</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PRESETS.map(([w, h, name]) => (
            <button key={name} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px" }}
              onClick={() => { setWidth(w); setHeight(h); }}>
              {name} ({w}x{h})
            </button>
          ))}
        </div>
      </div>

      <button className="btn" onClick={download} style={{ marginBottom: 16 }}>Download PNG</button>

      <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: 8, padding: 8, background: "var(--surface)" }}>
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", display: "block" }} />
      </div>
    </main>
  );
}
