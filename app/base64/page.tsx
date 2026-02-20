"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

export default function Base64() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const { copy, Toast } = useCopyToast();

  const process = () => {
    try {
      setError("");
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input.trim()))));
      }
    } catch {
      setError(
        mode === "encode"
          ? "Failed to encode. Check your input."
          : "Invalid Base64 string."
      );
      setOutput("");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
    setError("");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Base64 Encoder / Decoder</h1>
      <p className="text-[var(--muted)] mb-6">
        Encode text to Base64 or decode Base64 back to text. Supports UTF-8.
      </p>

      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as "encode" | "decode");
            setOutput("");
            setError("");
          }}
          className="!w-auto"
        >
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
        <button onClick={process} className="btn">
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
        <button onClick={swap} className="btn btn-secondary">
          ↕ Swap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            {mode === "encode" ? "Text Input" : "Base64 Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter Base64 to decode..."
            }
            rows={14}
            spellCheck={false}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--muted)]">
              {mode === "encode" ? "Base64 Output" : "Text Output"}
            </label>
            {output && (
              <button
                onClick={() => copy(output)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          <textarea value={output} readOnly rows={14} spellCheck={false} />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">
          About Base64 Encoding
        </h2>
        <p>
          Base64 is a binary-to-text encoding scheme that represents binary data
          as an ASCII string. It&apos;s commonly used for embedding images in
          HTML/CSS, transmitting binary data in JSON/XML, and encoding email
          attachments (MIME).
        </p>
      </section>
      <Toast />
    </div>
  );
}
