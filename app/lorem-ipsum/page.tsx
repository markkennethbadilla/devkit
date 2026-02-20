"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
  "Eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident.",
  "Sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus.",
  "Nulla gravida orci a odio.",
  "Nullam varius, turpis et commodo pharetra, est eros bibendum elit.",
  "Nec luctus magna felis sollicitudin mauris.",
  "Integer in mauris eu nibh euismod gravida.",
  "Duis ac tellus et risus vulputate vehicula.",
  "Donec lobortis risus a elit.",
  "Etiam tempor urna non sem ornare sed luctus dolor rutrum.",
  "Maecenas fermentum consequat mi.",
  "Donec fermentum, sem at interdum condimentum massa.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames.",
  "Ac turpis egestas sed tempus urna et pharetra pharetra massa.",
];

export default function LoremIpsum() {
  const [count, setCount] = useState(5);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const { copy, Toast } = useCopyToast();

  const generate = () => {
    if (unit === "paragraphs") {
      const paras = Array.from({ length: count }, () => {
        const len = 3 + Math.floor(Math.random() * 5);
        return Array.from({ length: len }, () => LOREM[Math.floor(Math.random() * LOREM.length)]).join(" ");
      });
      setOutput(paras.join("\n\n"));
    } else if (unit === "sentences") {
      const sents = Array.from({ length: count }, () => LOREM[Math.floor(Math.random() * LOREM.length)]);
      setOutput(sents.join(" "));
    } else {
      const words: string[] = [];
      while (words.length < count) {
        const sent = LOREM[Math.floor(Math.random() * LOREM.length)];
        words.push(...sent.split(" "));
      }
      setOutput(words.slice(0, count).join(" ") + ".");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Lorem Ipsum Generator</h1>
      <p className="text-[var(--muted)] mb-6">Generate placeholder text for designs, mockups, and prototypes.</p>
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <input type="number" value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} className="!w-20" min={1} />
        <select value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)} className="!w-auto">
          <option value="paragraphs">Paragraphs</option>
          <option value="sentences">Sentences</option>
          <option value="words">Words</option>
        </select>
        <button onClick={generate} className="btn">Generate</button>
      </div>
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--muted)]">{output.length} characters</span>
            <button onClick={() => copy(output)} className="text-xs text-[var(--accent)] hover:underline">Copy</button>
          </div>
          <textarea value={output} readOnly rows={16} spellCheck={false} className="!font-sans" />
        </div>
      )}
      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About Lorem Ipsum</h2>
        <p>Lorem Ipsum is placeholder text used in design and typesetting since the 1500s. It provides a natural distribution of letters and word lengths, making it ideal for previewing layouts without distracting with readable content.</p>
      </section>
      <Toast />
    </div>
  );
}
