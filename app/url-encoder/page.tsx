"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { copy, Toast } = useCopyToast();

  const process = () => {
    if (mode === "encode") {
      setOutput(encodeURIComponent(input));
    } else {
      try {
        setOutput(decodeURIComponent(input));
      } catch {
        setOutput("Error: Invalid encoded string");
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">URL Encoder / Decoder</h1>
      <p className="text-[var(--muted)] mb-6">
        Encode special characters for URLs or decode percent-encoded strings.
      </p>
      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={mode} onChange={(e) => { setMode(e.target.value as "encode" | "decode"); setOutput(""); }} className="!w-auto">
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
        <button onClick={process} className="btn">{mode === "encode" ? "Encode" : "Decode"}</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "https://example.com/path?q=hello world" : "https%3A%2F%2Fexample.com"} rows={10} spellCheck={false} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-[var(--muted)]">Output</label>
            {output && <button onClick={() => copy(output)} className="text-xs text-[var(--accent)] hover:underline">Copy</button>}
          </div>
          <textarea value={output} readOnly rows={10} spellCheck={false} />
        </div>
      </div>
      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About URL Encoding</h2>
        <p>URL encoding (percent-encoding) replaces unsafe characters with a % followed by their hex value. This is essential for query parameters, form data, and any text that needs to be included in a URL.</p>
      </section>
      <Toast />
    </div>
  );
}
