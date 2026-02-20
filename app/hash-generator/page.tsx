"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

async function computeHash(algo: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const algorithms = [
  { label: "SHA-256", value: "SHA-256" },
  { label: "SHA-384", value: "SHA-384" },
  { label: "SHA-512", value: "SHA-512" },
  { label: "SHA-1", value: "SHA-1" },
];

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<{ algo: string; hash: string }[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const { copy, Toast } = useCopyToast();

  const generate = async () => {
    if (!input) return;
    const hashes = await Promise.all(
      algorithms.map(async (a) => ({
        algo: a.label,
        hash: await computeHash(a.value, input),
      }))
    );
    setResults(hashes);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Hash Generator</h1>
      <p className="text-[var(--muted)] mb-6">
        Generate SHA-256, SHA-384, SHA-512, and SHA-1 hashes from any text.
        Uses the Web Crypto API — nothing leaves your browser.
      </p>
      <div className="mb-4">
        <label className="text-sm text-[var(--muted)] mb-1 block">Input Text</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash..." rows={5} spellCheck={false} />
      </div>
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <button onClick={generate} className="btn">Generate Hashes</button>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
          Uppercase
        </label>
      </div>
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r) => (
            <div key={r.algo} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-[var(--accent)]">{r.algo}</span>
                <button onClick={() => copy(uppercase ? r.hash.toUpperCase() : r.hash)} className="text-xs text-[var(--accent)] hover:underline">Copy</button>
              </div>
              <div className="font-mono text-sm break-all text-[var(--muted)]">
                {uppercase ? r.hash.toUpperCase() : r.hash}
              </div>
            </div>
          ))}
        </div>
      )}
      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About Cryptographic Hashing</h2>
        <p>A cryptographic hash function produces a fixed-size digest from arbitrary input. SHA-256 is widely used in TLS, Bitcoin, and data integrity verification. SHA-512 offers larger output for increased security. SHA-1 is deprecated for security but still used for checksums.</p>
      </section>
      <Toast />
    </div>
  );
}
