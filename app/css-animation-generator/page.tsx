"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface Keyframe {
  offset: number;
  transform: string;
  opacity: string;
  bgColor: string;
}

const PRESETS: { name: string; keyframes: Keyframe[]; duration: number; easing: string; iterations: string }[] = [
  {
    name: "Bounce",
    keyframes: [
      { offset: 0, transform: "translateY(0)", opacity: "1", bgColor: "" },
      { offset: 50, transform: "translateY(-30px)", opacity: "1", bgColor: "" },
      { offset: 100, transform: "translateY(0)", opacity: "1", bgColor: "" },
    ],
    duration: 0.6, easing: "ease", iterations: "infinite",
  },
  {
    name: "Fade In",
    keyframes: [
      { offset: 0, transform: "none", opacity: "0", bgColor: "" },
      { offset: 100, transform: "none", opacity: "1", bgColor: "" },
    ],
    duration: 0.5, easing: "ease-in", iterations: "1",
  },
  {
    name: "Spin",
    keyframes: [
      { offset: 0, transform: "rotate(0deg)", opacity: "1", bgColor: "" },
      { offset: 100, transform: "rotate(360deg)", opacity: "1", bgColor: "" },
    ],
    duration: 1, easing: "linear", iterations: "infinite",
  },
  {
    name: "Pulse",
    keyframes: [
      { offset: 0, transform: "scale(1)", opacity: "1", bgColor: "" },
      { offset: 50, transform: "scale(1.1)", opacity: "0.8", bgColor: "" },
      { offset: 100, transform: "scale(1)", opacity: "1", bgColor: "" },
    ],
    duration: 1.5, easing: "ease-in-out", iterations: "infinite",
  },
  {
    name: "Shake",
    keyframes: [
      { offset: 0, transform: "translateX(0)", opacity: "1", bgColor: "" },
      { offset: 25, transform: "translateX(-10px)", opacity: "1", bgColor: "" },
      { offset: 50, transform: "translateX(10px)", opacity: "1", bgColor: "" },
      { offset: 75, transform: "translateX(-10px)", opacity: "1", bgColor: "" },
      { offset: 100, transform: "translateX(0)", opacity: "1", bgColor: "" },
    ],
    duration: 0.4, easing: "ease-in-out", iterations: "1",
  },
  {
    name: "Slide In Left",
    keyframes: [
      { offset: 0, transform: "translateX(-100%)", opacity: "0", bgColor: "" },
      { offset: 100, transform: "translateX(0)", opacity: "1", bgColor: "" },
    ],
    duration: 0.5, easing: "ease-out", iterations: "1",
  },
  {
    name: "Color Shift",
    keyframes: [
      { offset: 0, transform: "none", opacity: "1", bgColor: "#3b82f6" },
      { offset: 33, transform: "none", opacity: "1", bgColor: "#22c55e" },
      { offset: 66, transform: "none", opacity: "1", bgColor: "#f59e0b" },
      { offset: 100, transform: "none", opacity: "1", bgColor: "#3b82f6" },
    ],
    duration: 3, easing: "linear", iterations: "infinite",
  },
];

const EASINGS = ["linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier(0.68,-0.55,0.27,1.55)"];

export default function CssAnimationGeneratorPage() {
  const { copy, Toast } = useCopyToast();
  const [keyframes, setKeyframes] = useState<Keyframe[]>(PRESETS[0].keyframes);
  const [duration, setDuration] = useState(0.6);
  const [easing, setEasing] = useState("ease");
  const [iterations, setIterations] = useState("infinite");
  const [animName, setAnimName] = useState("myAnimation");
  const [playing, setPlaying] = useState(true);

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx];
    setKeyframes(p.keyframes);
    setDuration(p.duration);
    setEasing(p.easing);
    setIterations(p.iterations);
  };

  const updateKeyframe = (idx: number, updates: Partial<Keyframe>) => {
    setKeyframes((prev) => prev.map((kf, i) => (i === idx ? { ...kf, ...updates } : kf)));
  };

  const addKeyframe = () => {
    setKeyframes((prev) => [...prev, { offset: 50, transform: "none", opacity: "1", bgColor: "" }]);
  };

  const removeKeyframe = (idx: number) => {
    if (keyframes.length <= 2) return;
    setKeyframes((prev) => prev.filter((_, i) => i !== idx));
  };

  const cssCode = useMemo(() => {
    const sorted = [...keyframes].sort((a, b) => a.offset - b.offset);
    let code = `@keyframes ${animName} {\n`;
    sorted.forEach((kf) => {
      const props: string[] = [];
      if (kf.transform && kf.transform !== "none") props.push(`    transform: ${kf.transform};`);
      if (kf.opacity && kf.opacity !== "1") props.push(`    opacity: ${kf.opacity};`);
      if (kf.bgColor) props.push(`    background-color: ${kf.bgColor};`);
      if (!props.length) props.push(`    /* no change */`);
      code += `  ${kf.offset}% {\n${props.join("\n")}\n  }\n`;
    });
    code += `}\n\n.animated-element {\n  animation: ${animName} ${duration}s ${easing} ${iterations};\n}`;
    return code;
  }, [keyframes, duration, easing, iterations, animName]);

  const inlineStyle = useMemo(() => {
    if (!playing) return {};
    const sorted = [...keyframes].sort((a, b) => a.offset - b.offset);
    const kfStr = sorted.map((kf) => {
      const props: string[] = [];
      if (kf.transform && kf.transform !== "none") props.push(`transform: ${kf.transform}`);
      if (kf.opacity && kf.opacity !== "1") props.push(`opacity: ${kf.opacity}`);
      if (kf.bgColor) props.push(`background-color: ${kf.bgColor}`);
      return `${kf.offset}% { ${props.join("; ")} }`;
    }).join(" ");
    return {
      animation: `preview ${duration}s ${easing} ${iterations === "infinite" ? "infinite" : iterations}`,
    } as React.CSSProperties;
  }, [keyframes, duration, easing, iterations, playing]);

  const styleTag = useMemo(() => {
    const sorted = [...keyframes].sort((a, b) => a.offset - b.offset);
    const kfStr = sorted.map((kf) => {
      const props: string[] = [];
      if (kf.transform && kf.transform !== "none") props.push(`transform:${kf.transform}`);
      if (kf.opacity && kf.opacity !== "1") props.push(`opacity:${kf.opacity}`);
      if (kf.bgColor) props.push(`background-color:${kf.bgColor}`);
      return `${kf.offset}%{${props.join(";")}}`;
    }).join("");
    return `@keyframes preview{${kfStr}}`;
  }, [keyframes]);

  return (
    <main className="tool-container">
      <style dangerouslySetInnerHTML={{ __html: styleTag }} />
      <h1 className="tool-title">CSS Animation Generator</h1>
      <p className="tool-desc">Build CSS keyframe animations visually. Configure timing, preview live, and copy the code.</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {PRESETS.map((p, i) => (
          <button key={p.name} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px" }}
            onClick={() => applyPreset(i)}>{p.name}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
            <label style={{ fontSize: 12 }}>
              Name: <input type="text" value={animName} onChange={(e) => setAnimName(e.target.value || "anim")}
              style={{ width: 120, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
            </label>
            <label style={{ fontSize: 12 }}>
              Duration: <input type="number" min={0.1} max={20} step={0.1} value={duration} onChange={(e) => setDuration(+e.target.value)}
              style={{ width: 60, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />s
            </label>
            <label style={{ fontSize: 12 }}>
              Easing: <select value={easing} onChange={(e) => setEasing(e.target.value)}
              style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }}>
                {EASINGS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12 }}>
              Iterations: <input type="text" value={iterations} onChange={(e) => setIterations(e.target.value)}
              style={{ width: 70, background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "3px 6px", fontSize: 12 }} />
            </label>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Keyframes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {keyframes.map((kf, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
                padding: "6px 10px", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap",
              }}>
                <label style={{ fontSize: 11 }}>
                  <input type="number" min={0} max={100} value={kf.offset} onChange={(e) => updateKeyframe(i, { offset: +e.target.value })}
                  style={{ width: 45, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 4px", fontSize: 11 }} />%
                </label>
                <label style={{ fontSize: 11 }}>
                  transform: <input type="text" value={kf.transform} onChange={(e) => updateKeyframe(i, { transform: e.target.value })}
                  style={{ width: 140, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 4px", fontSize: 11 }} />
                </label>
                <label style={{ fontSize: 11 }}>
                  opacity: <input type="text" value={kf.opacity} onChange={(e) => updateKeyframe(i, { opacity: e.target.value })}
                  style={{ width: 40, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 4px", fontSize: 11 }} />
                </label>
                <label style={{ fontSize: 11 }}>
                  bg: <input type="text" value={kf.bgColor} onChange={(e) => updateKeyframe(i, { bgColor: e.target.value })} placeholder="#hex"
                  style={{ width: 70, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 3, padding: "2px 4px", fontSize: 11 }} />
                </label>
                {keyframes.length > 2 && (
                  <button onClick={() => removeKeyframe(i)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>X</button>
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={addKeyframe} style={{ fontSize: 11, marginTop: 6 }}>+ Add Keyframe</button>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Preview</div>
          <div style={{
            width: "100%", height: 200, background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div key={playing ? "play" : "stop"} style={{
              width: 60, height: 60, borderRadius: 8,
              background: keyframes[0]?.bgColor || "var(--accent)",
              ...inlineStyle,
            }} />
          </div>
          <button className="btn btn-secondary" onClick={() => setPlaying(!playing)}
            style={{ fontSize: 11, marginTop: 6, width: "100%" }}>
            {playing ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Generated CSS</div>
      <div style={{ position: "relative" }}>
        <pre style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
          padding: 14, fontSize: 12, fontFamily: "monospace", overflow: "auto", maxHeight: 300,
          color: "var(--foreground)",
        }}>{cssCode}</pre>
        <button className="btn" onClick={() => copy(cssCode)}
          style={{ position: "absolute", top: 8, right: 8, fontSize: 11, padding: "4px 10px" }}>Copy CSS</button>
      </div>

      <Toast />
    </main>
  );
}
