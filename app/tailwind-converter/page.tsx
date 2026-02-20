"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// CSS property to Tailwind class mapping
const SPACING_MAP: Record<string, string> = {
  "0": "0", "1px": "px", "0.125rem": "0.5", "0.25rem": "1", "0.375rem": "1.5",
  "0.5rem": "2", "0.625rem": "2.5", "0.75rem": "3", "0.875rem": "3.5",
  "1rem": "4", "1.25rem": "5", "1.5rem": "6", "1.75rem": "7", "2rem": "8",
  "2.25rem": "9", "2.5rem": "10", "2.75rem": "11", "3rem": "12", "3.5rem": "14",
  "4rem": "16", "5rem": "20", "6rem": "24", "7rem": "28", "8rem": "32",
  "9rem": "36", "10rem": "40", "11rem": "44", "12rem": "48", "13rem": "52",
  "14rem": "56", "15rem": "60", "16rem": "64", "18rem": "72", "20rem": "80",
  "24rem": "96", "auto": "auto", "100%": "full", "100vw": "screen",
  "4px": "1", "8px": "2", "12px": "3", "16px": "4", "20px": "5", "24px": "6",
  "32px": "8", "40px": "10", "48px": "12", "64px": "16",
};

const FONT_SIZE_MAP: Record<string, string> = {
  "0.75rem": "xs", "0.875rem": "sm", "1rem": "base", "1.125rem": "lg",
  "1.25rem": "xl", "1.5rem": "2xl", "1.875rem": "3xl", "2.25rem": "4xl",
  "3rem": "5xl", "3.75rem": "6xl", "4.5rem": "7xl", "6rem": "8xl", "8rem": "9xl",
  "12px": "xs", "14px": "sm", "16px": "base", "18px": "lg", "20px": "xl",
  "24px": "2xl", "30px": "3xl", "36px": "4xl", "48px": "5xl", "60px": "6xl",
};

const FONT_WEIGHT_MAP: Record<string, string> = {
  "100": "thin", "200": "extralight", "300": "light", "400": "normal",
  "500": "medium", "600": "semibold", "700": "bold", "800": "extrabold", "900": "black",
};

const BORDER_RADIUS_MAP: Record<string, string> = {
  "0": "none", "0.125rem": "sm", "0.25rem": "DEFAULT", "0.375rem": "md",
  "0.5rem": "lg", "0.75rem": "xl", "1rem": "2xl", "1.5rem": "3xl", "9999px": "full",
  "2px": "sm", "4px": "DEFAULT", "6px": "md", "8px": "lg", "12px": "xl", "16px": "2xl",
};

function cssToTailwind(css: string): { classes: string[]; unknowns: string[] } {
  const classes: string[] = [];
  const unknowns: string[] = [];

  // Parse CSS declarations
  const declarations = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split(";")
    .map((d) => d.trim())
    .filter((d) => d.includes(":"));

  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    const prop = decl.slice(0, colonIdx).trim().toLowerCase();
    const val = decl.slice(colonIdx + 1).trim().toLowerCase();

    let matched = false;

    // Display
    if (prop === "display") {
      const map: Record<string, string> = { flex: "flex", grid: "grid", block: "block", "inline-block": "inline-block", inline: "inline", "inline-flex": "inline-flex", none: "hidden", "inline-grid": "inline-grid" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }

    // Position
    if (prop === "position") {
      const map: Record<string, string> = { static: "static", fixed: "fixed", absolute: "absolute", relative: "relative", sticky: "sticky" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }

    // Flexbox
    if (prop === "flex-direction") {
      const map: Record<string, string> = { row: "flex-row", column: "flex-col", "row-reverse": "flex-row-reverse", "column-reverse": "flex-col-reverse" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }
    if (prop === "flex-wrap") {
      const map: Record<string, string> = { wrap: "flex-wrap", nowrap: "flex-nowrap", "wrap-reverse": "flex-wrap-reverse" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }
    if (prop === "justify-content") {
      const map: Record<string, string> = { "flex-start": "justify-start", "flex-end": "justify-end", center: "justify-center", "space-between": "justify-between", "space-around": "justify-around", "space-evenly": "justify-evenly" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }
    if (prop === "align-items") {
      const map: Record<string, string> = { "flex-start": "items-start", "flex-end": "items-end", center: "items-center", baseline: "items-baseline", stretch: "items-stretch" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }

    // Spacing (margin/padding)
    for (const [cssProp, prefix] of [["margin", "m"], ["padding", "p"]] as const) {
      if (prop === cssProp && SPACING_MAP[val]) { classes.push(`${prefix}-${SPACING_MAP[val]}`); matched = true; }
      for (const [side, suffix] of [["top", "t"], ["right", "r"], ["bottom", "b"], ["left", "l"]] as const) {
        if (prop === `${cssProp}-${side}` && SPACING_MAP[val]) { classes.push(`${prefix}${suffix}-${SPACING_MAP[val]}`); matched = true; }
      }
    }

    // Gap
    if (prop === "gap" && SPACING_MAP[val]) { classes.push(`gap-${SPACING_MAP[val]}`); matched = true; }

    // Width/Height
    if (prop === "width" && SPACING_MAP[val]) { classes.push(`w-${SPACING_MAP[val]}`); matched = true; }
    if (prop === "height" && SPACING_MAP[val]) { classes.push(`h-${SPACING_MAP[val]}`); matched = true; }

    // Font size
    if (prop === "font-size" && FONT_SIZE_MAP[val]) { classes.push(`text-${FONT_SIZE_MAP[val]}`); matched = true; }

    // Font weight
    if (prop === "font-weight" && FONT_WEIGHT_MAP[val]) { classes.push(`font-${FONT_WEIGHT_MAP[val]}`); matched = true; }

    // Text align
    if (prop === "text-align") {
      const map: Record<string, string> = { left: "text-left", center: "text-center", right: "text-right", justify: "text-justify" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }

    // Border radius
    if (prop === "border-radius") {
      const bm = BORDER_RADIUS_MAP[val];
      if (bm === "DEFAULT") { classes.push("rounded"); matched = true; }
      else if (bm) { classes.push(`rounded-${bm}`); matched = true; }
    }

    // Overflow
    if (prop === "overflow") {
      const map: Record<string, string> = { hidden: "overflow-hidden", auto: "overflow-auto", scroll: "overflow-scroll", visible: "overflow-visible" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }

    // Cursor
    if (prop === "cursor") {
      const map: Record<string, string> = { pointer: "cursor-pointer", default: "cursor-default", "not-allowed": "cursor-not-allowed", wait: "cursor-wait", text: "cursor-text", move: "cursor-move" };
      if (map[val]) { classes.push(map[val]); matched = true; }
    }

    // Opacity
    if (prop === "opacity") {
      const pct = Math.round(parseFloat(val) * 100);
      const valid = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
      if (valid.includes(pct)) { classes.push(`opacity-${pct}`); matched = true; }
    }

    // Arbitrary value fallback for colors
    if ((prop === "color" || prop === "background-color" || prop === "background") && val.startsWith("#")) {
      const prefix2 = prop === "color" ? "text" : "bg";
      classes.push(`${prefix2}-[${val}]`);
      matched = true;
    }

    if (!matched) {
      unknowns.push(`${prop}: ${val}`);
    }
  }

  return { classes, unknowns };
}

export default function TailwindConverterPage() {
  const { copy, Toast } = useCopyToast();
  const [css, setCss] = useState(`display: flex;
justify-content: center;
align-items: center;
padding: 1rem;
margin-bottom: 0.5rem;
font-size: 1.125rem;
font-weight: 700;
border-radius: 0.5rem;
cursor: pointer;
opacity: 0.9;`);

  const result = useMemo(() => cssToTailwind(css), [css]);
  const classString = result.classes.join(" ");

  return (
    <main className="tool-container">
      <h1 className="tool-title">CSS to Tailwind Converter</h1>
      <p className="tool-desc">Convert plain CSS declarations to Tailwind CSS utility classes. Supports spacing, typography, flexbox, display, and more.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>CSS Input</div>
          <textarea value={css} onChange={(e) => setCss(e.target.value)} rows={14}
            style={{
              width: "100%", background: "var(--surface)", color: "var(--foreground)",
              border: "1px solid var(--border)", borderRadius: 6, padding: "10px",
              fontSize: 13, fontFamily: "monospace", resize: "vertical",
            }} spellCheck={false} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Tailwind Classes</span>
            <button className="btn" onClick={() => copy(classString)} style={{ fontSize: 12 }}>Copy</button>
          </div>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
            padding: 12, minHeight: 200,
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {result.classes.map((cls, i) => (
                <span key={i} onClick={() => copy(cls)} style={{
                  padding: "4px 8px", borderRadius: 4, fontSize: 13, fontFamily: "monospace",
                  background: "var(--accent)", color: "#fff", cursor: "pointer",
                }}>{cls}</span>
              ))}
            </div>
            {result.unknowns.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Not converted ({result.unknowns.length}):</div>
                {result.unknowns.map((u, i) => (
                  <div key={i} style={{ fontSize: 12, fontFamily: "monospace", color: "#f59e0b", marginBottom: 2 }}>{u}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full class string */}
      {classString && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Full class string</div>
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
            padding: "10px", fontFamily: "monospace", fontSize: 13, wordBreak: "break-all",
          }}>
            class=&quot;{classString}&quot;
          </div>
        </div>
      )}

      <Toast />
    </main>
  );
}
