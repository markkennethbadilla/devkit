"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const bases = [
  { name: "Binary", base: 2, prefix: "0b", placeholder: "101010" },
  { name: "Octal", base: 8, prefix: "0o", placeholder: "52" },
  { name: "Decimal", base: 10, prefix: "", placeholder: "42" },
  { name: "Hexadecimal", base: 16, prefix: "0x", placeholder: "2A" },
] as const;

function tryParseBigInt(value: string, base: number): bigint | null {
  const clean = value.trim().toLowerCase();
  if (!clean) return null;

  // Strip common prefixes
  let stripped = clean;
  if (base === 2 && clean.startsWith("0b")) stripped = clean.slice(2);
  else if (base === 8 && clean.startsWith("0o")) stripped = clean.slice(2);
  else if (base === 16 && clean.startsWith("0x")) stripped = clean.slice(2);

  if (!stripped) return null;

  const validChars: Record<number, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-f]+$/,
  };

  if (!validChars[base]?.test(stripped)) return null;

  try {
    if (base === 10) return BigInt(stripped);
    if (base === 16) return BigInt("0x" + stripped);
    if (base === 8) return BigInt("0o" + stripped);
    if (base === 2) return BigInt("0b" + stripped);
    return null;
  } catch {
    return null;
  }
}

function formatBigInt(value: bigint, base: number): string {
  return value.toString(base).toUpperCase();
}

function groupDigits(str: string, groupSize: number): string {
  const reversed = str.split("").reverse();
  const groups: string[] = [];
  for (let i = 0; i < reversed.length; i += groupSize) {
    groups.push(reversed.slice(i, i + groupSize).reverse().join(""));
  }
  return groups.reverse().join(" ");
}

export default function NumberBaseConverter() {
  const [inputBase, setInputBase] = useState(10);
  const [inputValue, setInputValue] = useState("");
  const { copy, Toast } = useCopyToast();

  const parsed = useMemo(
    () => tryParseBigInt(inputValue, inputBase),
    [inputValue, inputBase]
  );

  const currentBaseInfo = bases.find((b) => b.base === inputBase)!;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Number Base Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert between binary, octal, decimal, and hexadecimal. Supports
        arbitrarily large integers.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {bases.map((b) => (
          <button
            key={b.base}
            onClick={() => {
              if (parsed !== null) {
                setInputValue(formatBigInt(parsed, b.base));
              }
              setInputBase(b.base);
            }}
            className={inputBase === b.base ? "btn" : "btn-secondary"}
          >
            {b.name} (Base {b.base})
          </button>
        ))}
      </div>

      <div className="relative">
        {currentBaseInfo.prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] font-mono text-sm">
            {currentBaseInfo.prefix}
          </span>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={currentBaseInfo.placeholder}
          className="font-mono"
          style={currentBaseInfo.prefix ? { paddingLeft: "2.5rem" } : {}}
          spellCheck={false}
        />
      </div>

      {inputValue && parsed === null && (
        <div className="text-red-400 text-sm mt-2">
          Invalid {currentBaseInfo.name.toLowerCase()} number
        </div>
      )}

      {parsed !== null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {bases.map((b) => {
            const raw = formatBigInt(parsed, b.base);
            const groupSize = b.base === 2 ? 4 : b.base === 16 ? 4 : b.base === 8 ? 3 : 3;
            const grouped = groupDigits(raw, groupSize);
            return (
              <button
                key={b.base}
                onClick={() => copy(raw)}
                className="text-left p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--muted)]">
                    {b.name} (Base {b.base})
                  </span>
                  {b.base === inputBase && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)]">
                      input
                    </span>
                  )}
                </div>
                <div className="font-mono text-sm break-all">
                  {b.prefix && (
                    <span className="text-[var(--muted)]">{b.prefix}</span>
                  )}
                  {grouped}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {parsed !== null && (
        <div className="mt-4 text-sm text-[var(--muted)]">
          Bit length: {formatBigInt(parsed, 2).length} bits
        </div>
      )}

      <Toast />
    </div>
  );
}
