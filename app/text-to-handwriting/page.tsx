"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const FONTS = [
  { name: "Cursive", css: "cursive" },
  { name: "Serif", css: "Georgia, serif" },
  { name: "Handwriting", css: "'Segoe Script', 'Comic Sans MS', cursive" },
  { name: "Monospace", css: "'Courier New', monospace" },
];

const PAPER_STYLES: { name: string; bg: string; lineColor: string }[] = [
  { name: "White", bg: "#ffffff", lineColor: "#e0e0e0" },
  { name: "Lined", bg: "#fffef5", lineColor: "#add8e6" },
  { name: "Grid", bg: "#f9f9f9", lineColor: "#ddd" },
  { name: "Aged", bg: "#f5e6c8", lineColor: "#d4c5a0" },
];

export default function TextToHandwritingPage() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.\n\nThis is a sample handwriting preview.\nCustomize the settings on the left.");
  const [font, setFont] = useState(0);
  const [fontSize, setFontSize] = useState(22);
  const [color, setColor] = useState("#1a1a6e");
  const [lineHeight, setLineHeight] = useState(2.0);
  const [paper, setPaper] = useState(1);
  const [marginLeft, setMarginLeft] = useState(60);
  const [showLines, setShowLines] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = 800;
    const lineSpacing = fontSize * lineHeight;
    const lines = text.split("\n");
    const h = Math.max(400, lines.length * lineSpacing + 80);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ps = PAPER_STYLES[paper];
    ctx.fillStyle = ps.bg;
    ctx.fillRect(0, 0, w, h);

    if (showLines) {
      ctx.strokeStyle = ps.lineColor;
      ctx.lineWidth = 1;
      for (let y = 40 + lineSpacing; y < h; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      if (paper === 2) {
        for (let x = 0; x < w; x += lineSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
      }
    }

    if (marginLeft > 0) {
      ctx.strokeStyle = "#ff9999";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(marginLeft, 0);
      ctx.lineTo(marginLeft, h);
      ctx.stroke();
    }

    ctx.font = `${fontSize}px ${FONTS[font].css}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "bottom";

    lines.forEach((line, i) => {
      const y = 40 + (i + 1) * lineSpacing;
      const chars = line.split("");
      let x = marginLeft + 10;
      chars.forEach((ch) => {
        const jitterX = (Math.random() - 0.5) * 1.5;
        const jitterY = (Math.random() - 0.5) * 2;
        const jitterAngle = (Math.random() - 0.5) * 0.03;
        ctx.save();
        ctx.translate(x + jitterX, y + jitterY);
        ctx.rotate(jitterAngle);
        ctx.fillText(ch, 0, 0);
        ctx.restore();
        x += ctx.measureText(ch).width + (Math.random() * 1.5);
      });
    });
  }, [text, font, fontSize, color, lineHeight, paper, marginLeft, showLines]);

  useEffect(() => { draw(); }, [draw]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "handwriting.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">Text to Handwriting</h1>
      <p className="tool-desc">Convert text to handwriting-style images with customizable font, color, and paper style.</p>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6}
            placeholder="Type your text here..."
            style={{
              width: "100%", fontFamily: "monospace", fontSize: 13, resize: "vertical",
              background: "var(--surface)", color: "var(--foreground)",
              border: "1px solid var(--border)", borderRadius: 6, padding: 8,
            }} />
          <label style={{ fontSize: 12 }}>
            Font
            <select value={font} onChange={(e) => setFont(+e.target.value)}
              style={{ width: "100%", marginTop: 4, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px" }}>
              {FONTS.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 12 }}>
            Size: {fontSize}px
            <input type="range" min={12} max={48} value={fontSize} onChange={(e) => setFontSize(+e.target.value)}
              style={{ width: "100%", marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 12 }}>
            Line Height: {lineHeight.toFixed(1)}
            <input type="range" min={1.2} max={3.5} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(+e.target.value)}
              style={{ width: "100%", marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 12 }}>
            Ink Color
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 36, height: 30, border: "none", cursor: "pointer" }} />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)}
                style={{ flex: 1, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", fontSize: 12 }} />
            </div>
          </label>
          <label style={{ fontSize: 12 }}>
            Paper Style
            <select value={paper} onChange={(e) => setPaper(+e.target.value)}
              style={{ width: "100%", marginTop: 4, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px" }}>
              {PAPER_STYLES.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
            </select>
          </label>
          <label style={{ fontSize: 12 }}>
            Left Margin: {marginLeft}px
            <input type="range" min={0} max={120} value={marginLeft} onChange={(e) => setMarginLeft(+e.target.value)}
              style={{ width: "100%", marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} />
            Show ruled lines
          </label>
          <button className="btn" onClick={download}>Download PNG</button>
        </div>
        <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)", padding: 8 }}>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", display: "block", borderRadius: 4 }} />
        </div>
      </div>
    </main>
  );
}
