"use client";

import { useState, useEffect } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

type AlgoName = (typeof ALGORITHMS)[number];

async function hashText(text: string, algo: AlgoName): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Simple non-crypto MD5 (for display purposes, not security)
function md5(str: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xffffffff;
  }

  const n = str.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let i, s;
  for (i = 64; i <= n; i += 64) {
    const blk: number[] = [];
    for (s = i - 64; s < i; s += 4) {
      blk.push(
        str.charCodeAt(s) + (str.charCodeAt(s + 1) << 8) + (str.charCodeAt(s + 2) << 16) + (str.charCodeAt(s + 3) << 24)
      );
    }
    md5cycle(state, blk);
  }
  for (s = 0; s < 16; s++) tail[s] = 0;
  for (i = i - 64; i < n; i++) {
    tail[i >> 2] |= str.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[i >> 2] |= 0x80 << ((i % 4) << 3);
  if (i > 55) {
    md5cycle(state, tail);
    for (s = 0; s < 16; s++) tail[s] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);

  const hex_chr = "0123456789abcdef";
  let result = "";
  for (s = 0; s < 4; s++) {
    for (i = 0; i < 32; i += 8) {
      result += hex_chr.charAt((state[s] >> (i + 4)) & 0x0f) + hex_chr.charAt((state[s] >> i) & 0x0f);
    }
  }
  return result;
}

interface HashResult {
  algo: string;
  hash: string;
  bits: number;
}

export default function StringHashPage() {
  const [input, setInput] = useState("Hello, World!");
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const { copy, Toast } = useCopyToast();

  useEffect(() => {
    async function calculate() {
      if (!input) {
        setHashes([]);
        return;
      }
      const results: HashResult[] = [
        { algo: "MD5", hash: md5(input), bits: 128 },
      ];
      for (const algo of ALGORITHMS) {
        const hash = await hashText(input, algo);
        const bits = algo === "SHA-1" ? 160 : algo === "SHA-256" ? 256 : algo === "SHA-384" ? 384 : 512;
        results.push({ algo, hash, bits });
      }
      setHashes(results);
    }
    calculate();
  }, [input]);

  const format = (h: string) => (uppercase ? h.toUpperCase() : h);

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>
        String Hash Generator
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        Hash text with MD5, SHA-1, SHA-256, SHA-384, and SHA-512 simultaneously.
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1rem" }}>
        <label style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
          />
          Uppercase
        </label>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
        placeholder="Type or paste text to hash..."
        style={{
          width: "100%",
          minHeight: 100,
          fontFamily: "monospace",
          fontSize: "0.85rem",
          padding: "0.8rem",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--foreground)",
          resize: "vertical",
          lineHeight: 1.5,
          marginBottom: "1.5rem",
        }}
      />

      {/* Results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {hashes.map((h) => (
          <div
            key={h.algo}
            style={{
              padding: "0.7rem 1rem",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div style={{ minWidth: 80 }}>
              <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{h.algo}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{h.bits} bits</div>
            </div>
            <code
              style={{
                flex: 1,
                fontFamily: "monospace",
                fontSize: "0.78rem",
                wordBreak: "break-all",
                lineHeight: 1.5,
                color: "var(--accent)",
              }}
            >
              {format(h.hash)}
            </code>
            <button
              className="btn-secondary"
              onClick={() => copy(format(h.hash))}
              style={{ fontSize: "0.72rem", padding: "2px 8px", flexShrink: 0 }}
            >
              Copy
            </button>
          </div>
        ))}
        {hashes.length === 0 && input === "" && (
          <div style={{ color: "var(--muted)", fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>
            Type text above to generate hashes
          </div>
        )}
      </div>

      {/* Copy all */}
      {hashes.length > 0 && (
        <button
          className="btn"
          onClick={() => copy(hashes.map((h) => `${h.algo}: ${format(h.hash)}`).join("\n"))}
          style={{ marginTop: "1rem" }}
        >
          Copy All Hashes
        </button>
      )}

      <Toast />
    </main>
  );
}
