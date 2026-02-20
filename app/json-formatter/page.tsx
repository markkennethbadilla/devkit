"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";
import type { Metadata } from "next";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const { copy, Toast } = useCopyToast();

  const format = () => {
    try {
      setError("");
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      setError("");
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError("");
      setOutput("✓ Valid JSON");
    } catch (e: unknown) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">JSON Formatter & Validator</h1>
      <p className="text-[var(--muted)] mb-6">
        Paste your JSON to format, minify, or validate it. Everything runs
        locally in your browser.
      </p>

      <div className="flex gap-3 mb-4 flex-wrap">
        <button onClick={format} className="btn">
          Format
        </button>
        <button onClick={minify} className="btn btn-secondary">
          Minify
        </button>
        <button onClick={validate} className="btn btn-secondary">
          Validate
        </button>
        <select
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="!w-auto !px-3"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={1}>1 tab</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            rows={18}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--muted)]">Output</label>
            {output && (
              <button
                onClick={() => copy(output)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          <textarea value={output} readOnly rows={18} spellCheck={false} />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">
          About JSON Formatter
        </h2>
        <p>
          JSON (JavaScript Object Notation) is a lightweight data interchange
          format. This tool helps you format, validate, and minify JSON data
          instantly in your browser. No data is sent to any server.
        </p>
        <p>
          Use the formatter to pretty-print compressed JSON for readability, or
          minify formatted JSON to reduce size for APIs and storage. The
          validator checks for syntax errors and reports the exact issue.
        </p>
      </section>
      <Toast />
    </div>
  );
}
