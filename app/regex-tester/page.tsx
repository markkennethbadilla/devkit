"use client";
import { useState, useMemo } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gi");
  const [testString, setTestString] = useState("");

  const results = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      let m;
      if (flags.includes("g")) {
        while ((m = regex.exec(testString)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (!m[0]) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testString);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
      return { matches, error: null };
    } catch (e: unknown) {
      return { matches: [], error: (e as Error).message };
    }
  }, [pattern, flags, testString]);

  const highlighted = useMemo(() => {
    if (!results || results.error || results.matches.length === 0) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const parts: { text: string; match: boolean }[] = [];
      let lastIndex = 0;
      let m;
      const tempRegex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      while ((m = tempRegex.exec(testString)) !== null) {
        if (m.index > lastIndex) parts.push({ text: testString.slice(lastIndex, m.index), match: false });
        parts.push({ text: m[0], match: true });
        lastIndex = m.index + m[0].length;
        if (!m[0]) { tempRegex.lastIndex++; lastIndex++; }
      }
      if (lastIndex < testString.length) parts.push({ text: testString.slice(lastIndex), match: false });
      return parts;
    } catch {
      return null;
    }
  }, [pattern, flags, testString, results]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Regex Tester</h1>
      <p className="text-[var(--muted)] mb-6">Test regular expressions with live matching, highlighting, and capture groups.</p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">Pattern</label>
          <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="[a-z]+@[a-z]+\.[a-z]+" spellCheck={false} />
        </div>
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">Flags</label>
          <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} className="!w-24" placeholder="gi" />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-[var(--muted)] mb-1 block">Test String</label>
        <textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="Enter text to test against..." rows={6} spellCheck={false} />
      </div>

      {results?.error && (
        <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-sm mb-4">{results.error}</div>
      )}

      {highlighted && (
        <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] mb-4 font-mono text-sm whitespace-pre-wrap break-all">
          {highlighted.map((p, i) =>
            p.match ? (
              <span key={i} className="bg-[var(--accent)]/30 text-[var(--accent)] rounded px-0.5">{p.text}</span>
            ) : (
              <span key={i}>{p.text}</span>
            )
          )}
        </div>
      )}

      {results && !results.error && results.matches.length > 0 && (
        <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          <div className="text-sm font-semibold text-[var(--accent)] mb-2">{results.matches.length} match{results.matches.length !== 1 ? "es" : ""}</div>
          <div className="space-y-1 text-sm font-mono">
            {results.matches.map((m, i) => (
              <div key={i} className="text-[var(--muted)]">
                <span className="text-[var(--fg)]">{i + 1}.</span> &quot;{m.match}&quot; at index {m.index}
                {m.groups.length > 0 && <span className="text-[var(--accent)]"> groups: [{m.groups.map((g) => `"${g}"`).join(", ")}]</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About Regular Expressions</h2>
        <p>Regular expressions (regex) are patterns used to match character combinations in strings. Common flags: g (global), i (case-insensitive), m (multiline), s (dotAll). Use capture groups with parentheses () to extract parts of matches.</p>
      </section>
    </div>
  );
}
