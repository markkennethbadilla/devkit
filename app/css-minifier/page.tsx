"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove comments
    .replace(/\s+/g, " ") // collapse whitespace
    .replace(/\s*([{}:;,>~+])\s*/g, "$1") // remove space around symbols
    .replace(/;}/g, "}") // remove last semicolon in block
    .replace(/^\s+|\s+$/g, ""); // trim
}

function beautifyCSS(css: string): string {
  let result = "";
  let indent = 0;
  const tab = "  ";

  // First minify to normalize
  const minified = minifyCSS(css);

  for (let i = 0; i < minified.length; i++) {
    const char = minified[i];

    if (char === "{") {
      result += " {\n" + tab.repeat(indent + 1);
      indent++;
    } else if (char === "}") {
      indent = Math.max(0, indent - 1);
      result = result.trimEnd();
      result += "\n" + tab.repeat(indent) + "}\n" + (indent === 0 ? "\n" : "") + tab.repeat(indent);
    } else if (char === ";") {
      result += ";\n" + tab.repeat(indent);
    } else if (char === ":" && minified[i + 1] !== ":") {
      result += ": ";
    } else if (char === ",") {
      result += ",\n" + tab.repeat(indent);
    } else {
      result += char;
    }
  }

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

export default function CSSMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ original: 0, result: 0 });
  const { copy, Toast } = useCopyToast();

  const doMinify = () => {
    const result = minifyCSS(input);
    setOutput(result);
    setStats({ original: input.length, result: result.length });
  };

  const doBeautify = () => {
    const result = beautifyCSS(input);
    setOutput(result);
    setStats({ original: input.length, result: result.length });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">CSS Minifier / Beautifier</h1>
      <p className="text-[var(--muted)] mb-6">
        Compress CSS to reduce file size or format minified CSS for readability.
      </p>

      <div className="flex gap-3 mb-4 flex-wrap">
        <button onClick={doMinify} className="btn">Minify</button>
        <button onClick={doBeautify} className="btn btn-secondary">Beautify</button>
        <button onClick={() => { setInput(""); setOutput(""); setStats({ original: 0, result: 0 }); }} className="btn btn-secondary">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">CSS Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            rows={16}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--muted)]">Output</label>
            {output && (
              <button onClick={() => copy(output)} className="text-xs text-[var(--accent)] hover:underline">
                Copy
              </button>
            )}
          </div>
          <textarea value={output} readOnly rows={16} spellCheck={false} />
        </div>
      </div>

      {stats.original > 0 && (
        <div className="mt-4 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm flex gap-6 flex-wrap">
          <div>
            <span className="text-[var(--muted)]">Original: </span>
            <span className="font-mono">{stats.original.toLocaleString()} bytes</span>
          </div>
          <div>
            <span className="text-[var(--muted)]">Result: </span>
            <span className="font-mono">{stats.result.toLocaleString()} bytes</span>
          </div>
          <div>
            <span className="text-[var(--muted)]">Saved: </span>
            <span className="font-mono text-[var(--accent)]">
              {stats.original > 0 ? ((1 - stats.result / stats.original) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}
