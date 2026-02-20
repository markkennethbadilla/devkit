"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type ShapeType = "polygon" | "circle" | "ellipse" | "inset";

interface Preset {
  name: string;
  type: ShapeType;
  value: string;
}

const PRESETS: Preset[] = [
  { name: "Triangle", type: "polygon", value: "polygon(50% 0%, 0% 100%, 100% 100%)" },
  { name: "Arrow Right", type: "polygon", value: "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)" },
  { name: "Arrow Left", type: "polygon", value: "polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)" },
  { name: "Pentagon", type: "polygon", value: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" },
  { name: "Hexagon", type: "polygon", value: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" },
  { name: "Star", type: "polygon", value: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" },
  { name: "Cross", type: "polygon", value: "polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)" },
  { name: "Chevron", type: "polygon", value: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%)" },
  { name: "Diamond", type: "polygon", value: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
  { name: "Trapezoid", type: "polygon", value: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" },
  { name: "Parallelogram", type: "polygon", value: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" },
  { name: "Circle", type: "circle", value: "circle(50% at 50% 50%)" },
  { name: "Ellipse", type: "ellipse", value: "ellipse(50% 35% at 50% 50%)" },
  { name: "Inset Rounded", type: "inset", value: "inset(10% round 20px)" },
  { name: "Inset", type: "inset", value: "inset(10% 15% 10% 15%)" },
  { name: "Octagon", type: "polygon", value: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" },
];

export default function CssClipPathPage() {
  const { copy, Toast } = useCopyToast();
  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState("");

  const clipPath = custom || PRESETS[selected].value;

  const cssCode = useMemo(() => {
    return `.element {\n  clip-path: ${clipPath};\n  -webkit-clip-path: ${clipPath};\n}`;
  }, [clipPath]);

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSS Clip-Path Generator</h1>
      <p className="tool-desc">Create CSS clip-path shapes with a visual preview. Pick a preset or write custom values.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Presets</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", maxHeight: 300, overflow: "auto" }}>
            {PRESETS.map((p, i) => (
              <button key={p.name} className={i === selected && !custom ? "btn" : "btn btn-secondary"}
                style={{ fontSize: 11, padding: "4px 8px" }}
                onClick={() => { setSelected(i); setCustom(""); }}>
                {p.name}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 16, marginBottom: 8 }}>Custom Value</div>
          <input type="text" value={custom} onChange={(e) => setCustom(e.target.value)}
            placeholder="e.g. polygon(50% 0%, 0% 100%, 100% 100%)"
            style={{
              width: "100%", background: "var(--surface)", color: "var(--foreground)",
              border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", fontSize: 13,
            }} />
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Preview</div>
          <div style={{
            width: "100%", aspectRatio: "1", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <div style={{
              width: "80%", height: "80%",
              background: "linear-gradient(135deg, var(--accent), #e879f9)",
              clipPath: clipPath,
              WebkitClipPath: clipPath,
              transition: "clip-path 0.3s ease",
            }} />
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Generated CSS</div>
      <div style={{ position: "relative" }}>
        <pre style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
          padding: 14, fontSize: 13, fontFamily: "monospace", overflow: "auto",
          color: "var(--foreground)",
        }}>{cssCode}</pre>
        <button className="btn" onClick={() => copy(cssCode)}
          style={{ position: "absolute", top: 8, right: 8, fontSize: 11, padding: "4px 10px" }}>
          Copy CSS
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn btn-secondary" onClick={() => copy(clipPath)} style={{ fontSize: 12 }}>
          Copy clip-path value only
        </button>
      </div>

      <Toast />
    </main>
  );
}
