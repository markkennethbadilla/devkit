"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bits = "";
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, "0");
  }

  // Pad to multiple of 5
  while (bits.length % 5 !== 0) {
    bits += "0";
  }

  let result = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    result += BASE32_ALPHABET[parseInt(chunk, 2)];
  }

  // Add padding
  while (result.length % 8 !== 0) {
    result += "=";
  }

  return result;
}

function base32Decode(input: string): string {
  const cleaned = input.replace(/=+$/, "").toUpperCase();

  let bits = "";
  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) throw new Error(`Invalid Base32 character: '${char}'`);
    bits += index.toString(2).padStart(5, "0");
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

export default function Base32EncoderPage() {
  const [input, setInput] = useState("Hello, World!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { copy, Toast } = useCopyToast();

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return mode === "encode" ? base32Encode(input) : base32Decode(input);
    } catch (e: unknown) {
      return `Error: ${e instanceof Error ? e.message : "Invalid input"}`;
    }
  }, [input, mode]);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Base32 Encoder / Decoder</h1>
      <p className="text-[var(--muted)] mb-6">
        Encode text to Base32 or decode Base32 strings. Uses RFC 4648 standard alphabet.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          className={mode === "encode" ? "btn" : "btn-secondary"}
          onClick={() => setMode("encode")}
        >
          Encode
        </button>
        <button
          className={mode === "decode" ? "btn" : "btn-secondary"}
          onClick={() => setMode("decode")}
        >
          Decode
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {mode === "encode" ? "Text Input" : "Base32 Input"}
        </label>
        <textarea
          className="w-full h-32 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base32 to decode..."}
          spellCheck={false}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          {mode === "encode" ? "Base32 Output" : "Decoded Text"}
        </label>
        <textarea
          className="w-full h-32 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm"
          value={output}
          readOnly
          placeholder="Output will appear here..."
        />
      </div>

      {input && !output.startsWith("Error") && (
        <div className="rounded bg-[var(--card)] border border-[var(--border)] p-3 mb-4 text-sm text-[var(--muted)]">
          Input: {new Blob([input]).size} bytes &middot; Output: {new Blob([output]).size} bytes
          {mode === "encode" && (
            <> &middot; Expansion: {((new Blob([output]).size / new Blob([input]).size) * 100 - 100).toFixed(0)}%</>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button className="btn" onClick={() => copy(output)}>
          Copy Output
        </button>
        <button
          className="btn-secondary"
          onClick={() => {
            // Swap: output becomes input, mode flips
            if (output && !output.startsWith("Error")) {
              setInput(output);
              setMode(mode === "encode" ? "decode" : "encode");
            }
          }}
        >
          Swap
        </button>
        <button className="btn-secondary" onClick={() => setInput("")}>
          Clear
        </button>
      </div>

      <Toast />
    </main>
  );
}
