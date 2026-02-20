"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

interface Claim {
  key: string;
  value: string;
  enabled: boolean;
}

const defaultClaims: Claim[] = [
  { key: "sub", value: "1234567890", enabled: true },
  { key: "name", value: "John Doe", enabled: true },
  { key: "iat", value: String(Math.floor(Date.now() / 1000)), enabled: true },
  { key: "exp", value: String(Math.floor(Date.now() / 1000) + 3600), enabled: true },
  { key: "iss", value: "devkit", enabled: false },
  { key: "aud", value: "https://example.com", enabled: false },
];

export default function JwtBuilderPage() {
  const [claims, setClaims] = useState<Claim[]>(defaultClaims);
  const [algorithm, setAlgorithm] = useState("HS256");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const { copy, Toast } = useCopyToast();

  const updateClaim = (index: number, field: keyof Claim, value: string | boolean) => {
    setClaims((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const removeClaim = (index: number) => {
    setClaims((prev) => prev.filter((_, i) => i !== index));
  };

  const addClaim = () => {
    if (!newKey.trim()) return;
    setClaims((prev) => [...prev, { key: newKey, value: newValue, enabled: true }]);
    setNewKey("");
    setNewValue("");
  };

  const header = useMemo(
    () => JSON.stringify({ alg: algorithm, typ: "JWT" }, null, 2),
    [algorithm]
  );

  const payload = useMemo(() => {
    const obj: Record<string, unknown> = {};
    for (const c of claims) {
      if (!c.enabled) continue;
      // Try to parse as number or boolean
      if (/^\d+$/.test(c.value)) {
        obj[c.key] = parseInt(c.value, 10);
      } else if (c.value === "true") {
        obj[c.key] = true;
      } else if (c.value === "false") {
        obj[c.key] = false;
      } else {
        obj[c.key] = c.value;
      }
    }
    return JSON.stringify(obj, null, 2);
  }, [claims]);

  const token = useMemo(() => {
    const headerB64 = base64UrlEncode(JSON.stringify({ alg: algorithm, typ: "JWT" }));
    const payloadObj: Record<string, unknown> = {};
    for (const c of claims) {
      if (!c.enabled) continue;
      if (/^\d+$/.test(c.value)) {
        payloadObj[c.key] = parseInt(c.value, 10);
      } else if (c.value === "true") {
        payloadObj[c.key] = true;
      } else if (c.value === "false") {
        payloadObj[c.key] = false;
      } else {
        payloadObj[c.key] = c.value;
      }
    }
    const payloadB64 = base64UrlEncode(JSON.stringify(payloadObj));
    // Unsigned token (signature placeholder)
    const signature = base64UrlEncode("signature-placeholder");
    return `${headerB64}.${payloadB64}.${signature}`;
  }, [algorithm, claims]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">JWT Builder</h1>
      <p className="text-[var(--muted)] mb-6">
        Build JSON Web Tokens by selecting claims, algorithm, and preview the encoded token.
        Note: Signing is simulated — use a proper library for production tokens.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Algorithm</label>
        <select
          className="rounded bg-[var(--card)] border border-[var(--border)] p-2 text-sm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="HS256">HS256</option>
          <option value="HS384">HS384</option>
          <option value="HS512">HS512</option>
          <option value="RS256">RS256</option>
          <option value="RS384">RS384</option>
          <option value="RS512">RS512</option>
          <option value="ES256">ES256</option>
          <option value="none">none</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Claims</label>
        <div className="space-y-2">
          {claims.map((claim, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={claim.enabled}
                onChange={(e) => updateClaim(i, "enabled", e.target.checked)}
              />
              <input
                className="w-32 rounded bg-[var(--card)] border border-[var(--border)] p-1.5 font-mono text-sm"
                value={claim.key}
                onChange={(e) => updateClaim(i, "key", e.target.value)}
                placeholder="key"
              />
              <input
                className="flex-1 rounded bg-[var(--card)] border border-[var(--border)] p-1.5 font-mono text-sm"
                value={claim.value}
                onChange={(e) => updateClaim(i, "value", e.target.value)}
                placeholder="value"
              />
              <button
                className="text-red-500 text-sm hover:text-red-400"
                onClick={() => removeClaim(i)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <input
            className="w-32 rounded bg-[var(--card)] border border-[var(--border)] p-1.5 font-mono text-sm"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="New key"
            onKeyDown={(e) => e.key === "Enter" && addClaim()}
          />
          <input
            className="flex-1 rounded bg-[var(--card)] border border-[var(--border)] p-1.5 font-mono text-sm"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="New value"
            onKeyDown={(e) => e.key === "Enter" && addClaim()}
          />
          <button className="btn text-sm" onClick={addClaim}>
            Add
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Header</label>
          <pre className="w-full rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm overflow-auto h-32">
            {header}
          </pre>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Payload</label>
          <pre className="w-full rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm overflow-auto h-32">
            {payload}
          </pre>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Encoded Token</label>
        <textarea
          className="w-full h-24 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm break-all"
          value={token}
          readOnly
        />
      </div>

      <div className="flex gap-2">
        <button className="btn" onClick={() => copy(token)}>
          Copy Token
        </button>
        <button className="btn-secondary" onClick={() => copy(header)}>
          Copy Header
        </button>
        <button className="btn-secondary" onClick={() => copy(payload)}>
          Copy Payload
        </button>
        <button
          className="btn-secondary"
          onClick={() => {
            setClaims(defaultClaims);
            setAlgorithm("HS256");
          }}
        >
          Reset
        </button>
      </div>

      <Toast />
    </main>
  );
}
