"use client";
import { useState, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(
  length: number,
  options: Record<string, boolean>
): string {
  let chars = "";
  if (options.uppercase) chars += CHARSETS.uppercase;
  if (options.lowercase) chars += CHARSETS.lowercase;
  if (options.numbers) chars += CHARSETS.numbers;
  if (options.symbols) chars += CHARSETS.symbols;
  if (!chars) chars = CHARSETS.lowercase;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => chars[v % chars.length]).join("");
}

function getStrength(
  length: number,
  options: Record<string, boolean>
): { label: string; color: string; percent: number } {
  let poolSize = 0;
  if (options.uppercase) poolSize += 26;
  if (options.lowercase) poolSize += 26;
  if (options.numbers) poolSize += 10;
  if (options.symbols) poolSize += 26;
  if (poolSize === 0) poolSize = 26;

  const entropy = Math.log2(poolSize) * length;
  if (entropy < 28) return { label: "Very Weak", color: "#ef4444", percent: 15 };
  if (entropy < 36) return { label: "Weak", color: "#f97316", percent: 30 };
  if (entropy < 60) return { label: "Fair", color: "#eab308", percent: 50 };
  if (entropy < 80) return { label: "Strong", color: "#22c55e", percent: 75 };
  return { label: "Very Strong", color: "#10b981", percent: 100 };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [passwords, setPasswords] = useState<string[]>([]);
  const { copy, Toast } = useCopyToast();

  const generate = useCallback(() => {
    const batch = Array.from({ length: 5 }, () =>
      generatePassword(length, options)
    );
    setPasswords(batch);
  }, [length, options]);

  const strength = getStrength(length, options);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Password Generator</h1>
      <p className="text-[var(--muted)] mb-6">
        Generate cryptographically secure random passwords. Click any password
        to copy it.
      </p>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            Length: {length}
          </label>
          <input
            type="range"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(+e.target.value)}
            className="w-full accent-[var(--accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--muted)]">
            <span>4</span>
            <span>128</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {(Object.keys(CHARSETS) as Array<keyof typeof CHARSETS>).map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) =>
                  setOptions((o) => ({ ...o, [key]: e.target.checked }))
                }
                className="accent-[var(--accent)]"
              />
              <span className="text-sm capitalize">{key}</span>
            </label>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-[var(--muted)]">Strength:</span>
            <span className="text-sm font-medium" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${strength.percent}%`,
                backgroundColor: strength.color,
              }}
            />
          </div>
        </div>

        <button onClick={generate} className="btn w-fit">
          Generate Passwords
        </button>
      </div>

      {passwords.length > 0 && (
        <div className="flex flex-col gap-2">
          {passwords.map((pw, i) => (
            <button
              key={i}
              onClick={() => copy(pw)}
              className="text-left font-mono text-sm p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer break-all"
            >
              {pw}
            </button>
          ))}
        </div>
      )}

      <Toast />
    </div>
  );
}
