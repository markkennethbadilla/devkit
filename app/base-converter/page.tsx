"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const COMMON_BASES = [
  { base: 2, name: "Binary" },
  { base: 8, name: "Octal" },
  { base: 10, name: "Decimal" },
  { base: 16, name: "Hexadecimal" },
  { base: 32, name: "Base32" },
  { base: 36, name: "Base36" },
];

export default function BaseConverterPage() {
  const { copy, Toast } = useCopyToast();
  const [input, setInput] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);

  const result = useMemo(() => {
    try {
      if (!input.trim()) return { value: "", error: "", decimal: 0 };
      const decimal = parseInt(input.trim(), fromBase);
      if (isNaN(decimal)) return { value: "", error: `Invalid number for base ${fromBase}`, decimal: 0 };
      return { value: decimal.toString(toBase).toUpperCase(), error: "", decimal };
    } catch {
      return { value: "", error: "Conversion error", decimal: 0 };
    }
  }, [input, fromBase, toBase]);

  const allBases = useMemo(() => {
    if (result.error || !input.trim()) return [];
    return COMMON_BASES.map((b) => ({
      ...b,
      value: result.decimal.toString(b.base).toUpperCase(),
    }));
  }, [result, input]);

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
    borderRadius: 6, padding: "8px 10px", fontSize: 14, fontFamily: "monospace", width: "100%",
  };

  const baseSelect = (value: number, onChange: (v: number) => void) => (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ ...inputStyle, width: 100 }}>
      {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
        <option key={b} value={b}>Base {b}</option>
      ))}
    </select>
  );

  return (
    <main className="tool-container">
      <h1 className="tool-title">Base Converter</h1>
      <p className="tool-desc">Convert numbers between any base from 2 (binary) to 36. Quick conversions for all common bases.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "end", marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>Input</span>
            {baseSelect(fromBase, setFromBase)}
          </div>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} style={inputStyle} spellCheck={false} placeholder="Enter a number..." />
        </div>
        <button className="btn btn-secondary" onClick={() => { setFromBase(toBase); setToBase(fromBase); setInput(result.value || input); }}
          style={{ marginBottom: 2, fontSize: 18, padding: "6px 12px" }} title="Swap">&#8644;</button>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>Output</span>
            {baseSelect(toBase, setToBase)}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input type="text" value={result.error || result.value} readOnly style={{ ...inputStyle, color: result.error ? "#ef4444" : "var(--foreground)" }} />
            <button className="btn btn-secondary" onClick={() => copy(result.value)} style={{ fontSize: 12, whiteSpace: "nowrap" }}>Copy</button>
          </div>
        </div>
      </div>

      {/* All common bases */}
      {allBases.length > 0 && (
        <>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>All Common Bases</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginBottom: 16 }}>
            {allBases.map((b) => (
              <div key={b.base} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ color: "var(--muted)", fontSize: 11 }}>{b.name} (base {b.base})</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 14, wordBreak: "break-all" }}>{b.value}</div>
                </div>
                <button className="btn btn-secondary" onClick={() => copy(b.value)} style={{ fontSize: 11, padding: "4px 8px" }}>Copy</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick reference */}
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Quick Reference</h3>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
        padding: 14, fontSize: 13, color: "var(--muted)", lineHeight: 1.6,
      }}>
        <div><strong>Base 2 (Binary):</strong> 0-1</div>
        <div><strong>Base 8 (Octal):</strong> 0-7</div>
        <div><strong>Base 10 (Decimal):</strong> 0-9</div>
        <div><strong>Base 16 (Hex):</strong> 0-9, A-F</div>
        <div><strong>Base 36:</strong> 0-9, A-Z</div>
      </div>

      <Toast />
    </main>
  );
}
