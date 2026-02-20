"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface Diff {
  path: string;
  type: "added" | "removed" | "changed";
  oldVal?: string;
  newVal?: string;
}

function deepDiff(a: unknown, b: unknown, path = "$"): Diff[] {
  const diffs: Diff[] = [];

  if (a === b) return diffs;
  if (a === null || b === null || typeof a !== typeof b) {
    diffs.push({ path, type: "changed", oldVal: JSON.stringify(a), newVal: JSON.stringify(b) });
    return diffs;
  }
  if (typeof a !== "object") {
    diffs.push({ path, type: "changed", oldVal: JSON.stringify(a), newVal: JSON.stringify(b) });
    return diffs;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= a.length) {
        diffs.push({ path: `${path}[${i}]`, type: "added", newVal: JSON.stringify(b[i]) });
      } else if (i >= b.length) {
        diffs.push({ path: `${path}[${i}]`, type: "removed", oldVal: JSON.stringify(a[i]) });
      } else {
        diffs.push(...deepDiff(a[i], b[i], `${path}[${i}]`));
      }
    }
    return diffs;
  }
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const key of allKeys) {
    const childPath = `${path}.${key}`;
    if (!(key in aObj)) {
      diffs.push({ path: childPath, type: "added", newVal: JSON.stringify(bObj[key]) });
    } else if (!(key in bObj)) {
      diffs.push({ path: childPath, type: "removed", oldVal: JSON.stringify(aObj[key]) });
    } else {
      diffs.push(...deepDiff(aObj[key], bObj[key], childPath));
    }
  }
  return diffs;
}

const SAMPLE_A = `{
  "name": "DevKit",
  "version": "1.0.0",
  "features": ["tools", "dark-mode"],
  "config": {
    "theme": "dark",
    "lang": "en"
  }
}`;

const SAMPLE_B = `{
  "name": "DevKit",
  "version": "2.0.0",
  "features": ["tools", "dark-mode", "api"],
  "config": {
    "theme": "system",
    "lang": "en",
    "beta": true
  },
  "license": "MIT"
}`;

const TYPE_COLORS = { added: "#22c55e", removed: "#ef4444", changed: "#f59e0b" };
const TYPE_LABELS = { added: "Added", removed: "Removed", changed: "Changed" };

export default function JsonComparePage() {
  const { copy, Toast } = useCopyToast();
  const [left, setLeft] = useState(SAMPLE_A);
  const [right, setRight] = useState(SAMPLE_B);

  const result = useMemo(() => {
    try {
      const a = JSON.parse(left);
      const b = JSON.parse(right);
      return { diffs: deepDiff(a, b), error: "" };
    } catch (e) {
      return { diffs: [], error: String(e) };
    }
  }, [left, right]);

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--surface)", color: "var(--foreground)",
    border: "1px solid var(--border)", borderRadius: 6, padding: "10px",
    fontSize: 13, fontFamily: "monospace", resize: "vertical",
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">JSON Compare & Diff</h1>
      <p className="tool-desc">Deep compare two JSON objects and see all differences with path information.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Original JSON</div>
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} rows={12} style={inputStyle} spellCheck={false} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Modified JSON</div>
          <textarea value={right} onChange={(e) => setRight(e.target.value)} rows={12} style={inputStyle} spellCheck={false} />
        </div>
      </div>

      {result.error ? (
        <div style={{ color: "#ef4444", fontSize: 13, padding: 12, background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>{result.error}</div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              {result.diffs.length === 0 ? "No differences found" : `${result.diffs.length} difference${result.diffs.length > 1 ? "s" : ""} found`}
            </span>
            {result.diffs.length > 0 && (
              <button className="btn btn-secondary" onClick={() => copy(JSON.stringify(result.diffs, null, 2))} style={{ fontSize: 12 }}>Copy diff</button>
            )}
          </div>

          {/* Summary badges */}
          {result.diffs.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              {(["added", "removed", "changed"] as const).map((type) => {
                const count = result.diffs.filter((d) => d.type === type).length;
                if (count === 0) return null;
                return (
                  <span key={type} style={{
                    padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                    background: TYPE_COLORS[type] + "22", color: TYPE_COLORS[type],
                  }}>{count} {TYPE_LABELS[type]}</span>
                );
              })}
            </div>
          )}

          {/* Diff list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {result.diffs.map((d, i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
                padding: "10px 14px", borderLeft: `3px solid ${TYPE_COLORS[d.type]}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <code style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 600 }}>{d.path}</code>
                  <span style={{
                    fontSize: 10, padding: "2px 6px", borderRadius: 4,
                    background: TYPE_COLORS[d.type] + "22", color: TYPE_COLORS[d.type],
                  }}>{TYPE_LABELS[d.type]}</span>
                </div>
                <div style={{ fontSize: 12, fontFamily: "monospace" }}>
                  {d.oldVal !== undefined && <div style={{ color: "#ef4444" }}>- {d.oldVal}</div>}
                  {d.newVal !== undefined && <div style={{ color: "#22c55e" }}>+ {d.newVal}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Toast />
    </main>
  );
}
