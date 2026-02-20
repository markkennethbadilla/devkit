"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

export default function CharacterCounterPage() {
  const { copy, Toast } = useCopyToast();
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0) : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const bytes = new TextEncoder().encode(text).length;
    const unique = new Set(text.toLowerCase().replace(/\s/g, "")).size;

    // frequency
    const freq: Record<string, number> = {};
    for (const ch of text) {
      if (/\s/.test(ch)) continue;
      const lower = ch.toLowerCase();
      freq[lower] = (freq[lower] || 0) + 1;
    }
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const maxFreq = sorted[0]?.[1] || 1;

    // density
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    const lowerCount = (text.match(/[a-z]/g) || []).length;
    const digitCount = (text.match(/\d/g) || []).length;
    const specialCount = charsNoSpaces - upperCount - lowerCount - digitCount;

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, bytes, unique, sorted, maxFreq, upperCount, lowerCount, digitCount, specialCount };
  }, [text]);

  const statCards = [
    { label: "Characters", value: stats.chars },
    { label: "No Spaces", value: stats.charsNoSpaces },
    { label: "Words", value: stats.words },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Bytes (UTF-8)", value: stats.bytes },
    { label: "Unique Chars", value: stats.unique },
  ];

  const densityCards = [
    { label: "Uppercase", value: stats.upperCount, color: "#3b82f6" },
    { label: "Lowercase", value: stats.lowerCount, color: "#22c55e" },
    { label: "Digits", value: stats.digitCount, color: "#f59e0b" },
    { label: "Special", value: stats.specialCount, color: "#ef4444" },
  ];

  return (
    <main className="tool-container">
      <h1 className="tool-title">Character Counter</h1>
      <p className="tool-desc">Count characters, words, and analyze character frequency with detailed statistics.</p>

      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} spellCheck={false}
        placeholder="Type or paste text here..."
        style={{
          width: "100%", fontSize: 14, resize: "vertical",
          background: "var(--surface)", color: "var(--foreground)",
          border: "1px solid var(--border)", borderRadius: 8, padding: 12, marginBottom: 16,
        }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginBottom: 16 }}>
        {statCards.map((s) => (
          <div key={s.label} onClick={() => copy(String(s.value))} style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "10px 12px", textAlign: "center", cursor: "pointer",
          }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{s.value.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {stats.charsNoSpaces > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Character Density</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {densityCards.map((d) => (
              <div key={d.label} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{d.value}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>
                    ({stats.charsNoSpaces ? ((d.value / stats.charsNoSpaces) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{d.label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Character Frequency (Top 30)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {stats.sorted.slice(0, 30).map(([ch, count]) => (
              <div key={ch} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <code style={{
                  width: 28, textAlign: "center", fontFamily: "monospace", fontWeight: 600,
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 0",
                }}>{ch === " " ? "SPC" : ch}</code>
                <div style={{
                  flex: 1, height: 18, background: "var(--surface)", borderRadius: 4, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", width: `${(count / stats.maxFreq) * 100}%`,
                    background: "var(--accent)", borderRadius: 4, minWidth: 2,
                  }} />
                </div>
                <span style={{ color: "var(--muted)", minWidth: 50, textAlign: "right" }}>
                  {count} ({((count / stats.charsNoSpaces) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <Toast />
    </main>
  );
}
