"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function minifyJS(code: string): string {
  let result = code;
  // Remove single-line comments (not in strings)
  result = result.replace(/\/\/.*$/gm, "");
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Collapse multiple whitespace to single space
  result = result.replace(/\s+/g, " ");
  // Remove spaces around operators
  result = result.replace(/\s*([=+\-*/<>!&|,;:{}()[\]?])\s*/g, "$1");
  // Remove leading/trailing whitespace per line
  result = result.replace(/^\s+|\s+$/gm, "");
  // Add space after keywords where needed
  result = result.replace(/\b(var|let|const|return|throw|new|typeof|instanceof|in|of|delete|void|case|yield|await)\b(?=[^\s;,)}])/g, "$1 ");
  result = result.replace(/\b(function|class|extends|import|export|from|as|if|else|for|while|do|switch|try|catch|finally)\b(?=[^\s;,(){}])/g, "$1 ");
  // Remove empty lines
  result = result.replace(/\n+/g, "");
  return result.trim();
}

function beautifyJS(code: string): string {
  let result = code;
  let indent = 0;
  const lines: string[] = [];
  let current = "";

  for (let i = 0; i < result.length; i++) {
    const ch = result[i];
    if (ch === "{" || ch === "[") {
      current += ch;
      lines.push("  ".repeat(indent) + current.trim());
      current = "";
      indent++;
    } else if (ch === "}" || ch === "]") {
      if (current.trim()) lines.push("  ".repeat(indent) + current.trim());
      current = "";
      indent = Math.max(0, indent - 1);
      current += ch;
    } else if (ch === ";") {
      current += ch;
      lines.push("  ".repeat(indent) + current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push("  ".repeat(indent) + current.trim());
  return lines.join("\n");
}

const SAMPLE = `// Sample JavaScript code
function calculateTotal(items) {
  /* Calculate the total price
     of all items in the cart */
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // Apply discount if available
    const price = item.discount 
      ? item.price * (1 - item.discount) 
      : item.price;
    total += price * item.quantity;
  }
  
  return total;
}

// Export the function
export default calculateTotal;`;

export default function JsMinifierPage() {
  const { copy, Toast } = useCopyToast();
  const [input, setInput] = useState(SAMPLE);
  const [mode, setMode] = useState<"minify" | "beautify">("minify");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "minify" ? minifyJS(input) : beautifyJS(input);
  }, [input, mode]);

  const origBytes = new TextEncoder().encode(input).length;
  const outBytes = new TextEncoder().encode(output).length;
  const savings = origBytes > 0 ? ((1 - outBytes / origBytes) * 100).toFixed(1) : "0";

  return (
    <main className="tool-container">
      <h1 className="tool-title">JavaScript Minifier</h1>
      <p className="tool-desc">Minify or beautify JavaScript code. Remove comments, whitespace, and reduce file size.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <button className={mode === "minify" ? "btn" : "btn btn-secondary"} onClick={() => setMode("minify")} style={{ fontSize: 12 }}>Minify</button>
        <button className={mode === "beautify" ? "btn" : "btn btn-secondary"} onClick={() => setMode("beautify")} style={{ fontSize: 12 }}>Beautify</button>
        <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
          {origBytes.toLocaleString()} B → {outBytes.toLocaleString()} B
          {mode === "minify" && <span style={{ color: +savings > 0 ? "#22c55e" : "var(--muted)", marginLeft: 6 }}>({savings}% saved)</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Input</div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={16} spellCheck={false}
            style={{
              width: "100%", fontFamily: "monospace", fontSize: 12, resize: "vertical",
              background: "var(--surface)", color: "var(--foreground)",
              border: "1px solid var(--border)", borderRadius: 8, padding: 10,
            }} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Output</span>
            <button className="btn" onClick={() => copy(output)} style={{ fontSize: 11, padding: "2px 8px" }}>Copy</button>
          </div>
          <textarea value={output} readOnly rows={16} spellCheck={false}
            style={{
              width: "100%", fontFamily: "monospace", fontSize: 12, resize: "vertical",
              background: "var(--surface)", color: "var(--foreground)",
              border: "1px solid var(--border)", borderRadius: 8, padding: 10,
            }} />
        </div>
      </div>

      <Toast />
    </main>
  );
}
