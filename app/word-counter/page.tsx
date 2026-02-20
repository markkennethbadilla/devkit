"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
}

function analyzeText(text: string): Stats {
  if (!text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: "0 sec",
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = text.split("\n").length;

  const minutes = Math.floor(words / 200);
  const seconds = Math.round(((words % 200) / 200) * 60);
  const readingTime =
    minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} sec`;

  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime };
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const { copy, Toast } = useCopyToast();

  const stats = useMemo(() => analyzeText(text), [text]);

  const statCards = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "No Spaces", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
  ];

  const topWords = useMemo(() => {
    if (!text.trim()) return [];
    const freq: Record<string, number> = {};
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 1)
      .forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [text]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Word Counter & Text Analyzer</h1>
      <p className="text-[var(--muted)] mb-6">
        Analyze text in real time. Count words, characters, sentences, and estimate reading time.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
        {statCards.map((s) => (
          <div key={s.label} className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-center">
            <div className="text-2xl font-bold font-mono">{s.value.toLocaleString()}</div>
            <div className="text-xs text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-[var(--muted)]">
        <span>Reading time: <strong className="text-[var(--foreground)]">{stats.readingTime}</strong></span>
        <span className="ml-auto flex gap-2">
          <button onClick={() => copy(text)} className="text-xs text-[var(--accent)] hover:underline">Copy Text</button>
          <button onClick={() => setText("")} className="text-xs text-[var(--accent)] hover:underline">Clear</button>
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text here..."
        rows={14}
        spellCheck={false}
      />

      {topWords.length > 0 && (
        <div className="mt-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <h2 className="text-sm font-semibold mb-3">Top Words</h2>
          <div className="flex flex-wrap gap-2">
            {topWords.map(([word, count]) => (
              <span
                key={word}
                className="px-2 py-1 rounded text-sm bg-[var(--background)] border border-[var(--border)] font-mono"
              >
                {word} <span className="text-[var(--muted)]">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}
