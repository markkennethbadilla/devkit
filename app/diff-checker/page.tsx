"use client";
import { useState, useMemo } from "react";

interface DiffLine {
  type: "equal" | "add" | "remove";
  text: string;
  lineA?: number;
  lineB?: number;
}

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: DiffLine[] = [];

  // Simple LCS-based diff
  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (linesA[i] === linesB[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0, j = 0;
  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      result.push({ type: "equal", text: linesA[i], lineA: i + 1, lineB: j + 1 });
      i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: "add", text: linesB[j], lineB: j + 1 });
      j++;
    } else if (i < m) {
      result.push({ type: "remove", text: linesA[i], lineA: i + 1 });
      i++;
    }
  }
  return result;
}

export default function DiffChecker() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [showDiff, setShowDiff] = useState(false);

  const diff = useMemo(() => {
    if (!showDiff) return [];
    return computeDiff(textA, textB);
  }, [textA, textB, showDiff]);

  const stats = useMemo(() => {
    const added = diff.filter((d) => d.type === "add").length;
    const removed = diff.filter((d) => d.type === "remove").length;
    const unchanged = diff.filter((d) => d.type === "equal").length;
    return { added, removed, unchanged };
  }, [diff]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Diff Checker</h1>
      <p className="text-[var(--muted)] mb-6">Compare two texts and see line-by-line differences highlighted.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">Original</label>
          <textarea value={textA} onChange={(e) => { setTextA(e.target.value); setShowDiff(false); }} placeholder="Paste original text..." rows={14} spellCheck={false} />
        </div>
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">Changed</label>
          <textarea value={textB} onChange={(e) => { setTextB(e.target.value); setShowDiff(false); }} placeholder="Paste changed text..." rows={14} spellCheck={false} />
        </div>
      </div>

      <button onClick={() => setShowDiff(true)} className="btn mb-6">Compare</button>

      {showDiff && diff.length > 0 && (
        <div>
          <div className="flex gap-4 mb-3 text-sm">
            <span className="text-green-400">+{stats.added} added</span>
            <span className="text-red-400">-{stats.removed} removed</span>
            <span className="text-[var(--muted)]">{stats.unchanged} unchanged</span>
          </div>
          <div className="rounded-lg border border-[var(--border)] overflow-auto max-h-[500px]">
            <table className="w-full text-sm font-mono">
              <tbody>
                {diff.map((d, i) => (
                  <tr
                    key={i}
                    className={
                      d.type === "add"
                        ? "bg-green-950/30"
                        : d.type === "remove"
                        ? "bg-red-950/30"
                        : ""
                    }
                  >
                    <td className="px-2 py-0.5 text-[var(--muted)] text-right w-12 select-none border-r border-[var(--border)]">
                      {d.lineA ?? ""}
                    </td>
                    <td className="px-2 py-0.5 text-[var(--muted)] text-right w-12 select-none border-r border-[var(--border)]">
                      {d.lineB ?? ""}
                    </td>
                    <td className="px-2 py-0.5 w-6 text-center select-none">
                      {d.type === "add" ? (
                        <span className="text-green-400">+</span>
                      ) : d.type === "remove" ? (
                        <span className="text-red-400">-</span>
                      ) : (
                        <span className="text-[var(--muted)]">&nbsp;</span>
                      )}
                    </td>
                    <td className="px-2 py-0.5 whitespace-pre">{d.text || " "}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About Diff Checking</h2>
        <p>A diff (difference) tool compares two pieces of text and highlights what was added, removed, or unchanged. This is essential for code reviews, document comparisons, and tracking changes between versions. This tool uses the Longest Common Subsequence (LCS) algorithm.</p>
      </section>
    </div>
  );
}
