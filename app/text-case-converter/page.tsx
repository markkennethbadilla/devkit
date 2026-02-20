"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot"
  | "alternating"
  | "inverse";

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.replace(
        /\w\S*/g,
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      );
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case "camel": {
      const w = toWords(text);
      return w
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");
    }
    case "pascal": {
      const w = toWords(text);
      return w
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
    }
    case "snake":
      return toWords(text).join("_").toLowerCase();
    case "kebab":
      return toWords(text).join("-").toLowerCase();
    case "constant":
      return toWords(text).join("_").toUpperCase();
    case "dot":
      return toWords(text).join(".").toLowerCase();
    case "alternating":
      return text
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    case "inverse":
      return text
        .split("")
        .map((c) =>
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        )
        .join("");
    default:
      return text;
  }
}

const cases: { type: CaseType; label: string; example: string }[] = [
  { type: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { type: "lower", label: "lowercase", example: "hello world" },
  { type: "title", label: "Title Case", example: "Hello World" },
  { type: "sentence", label: "Sentence case", example: "Hello world" },
  { type: "camel", label: "camelCase", example: "helloWorld" },
  { type: "pascal", label: "PascalCase", example: "HelloWorld" },
  { type: "snake", label: "snake_case", example: "hello_world" },
  { type: "kebab", label: "kebab-case", example: "hello-world" },
  { type: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
  { type: "dot", label: "dot.case", example: "hello.world" },
  { type: "alternating", label: "aLtErNaTiNg", example: "hElLo WoRlD" },
  { type: "inverse", label: "InVeRsE", example: "hELLO wORLD" },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");
  const { copy, Toast } = useCopyToast();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Text Case Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert text between different cases. Click any result to copy it.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={5}
        spellCheck={false}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {cases.map((c) => {
          const result = input ? convertCase(input, c.type) : c.example;
          return (
            <button
              key={c.type}
              onClick={() => input && copy(result)}
              className="text-left p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              <div className="text-xs text-[var(--muted)] mb-1">{c.label}</div>
              <div className="font-mono text-sm truncate">
                {result}
              </div>
            </button>
          );
        })}
      </div>

      <Toast />
    </div>
  );
}
