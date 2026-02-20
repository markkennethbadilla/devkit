"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function decodeJwt(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: expected 3 parts separated by dots");

  const decode = (s: string) => {
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  };

  const header = decode(parts[0]);
  const payload = decode(parts[1]);

  // Check expiration
  let expInfo = "";
  if (payload.exp) {
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    expInfo = expDate > now
      ? `Expires: ${expDate.toISOString()} (valid)`
      : `Expired: ${expDate.toISOString()} (expired)`;
  }

  return { header, payload, signature: parts[2], expInfo };
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ header: object; payload: object; signature: string; expInfo: string } | null>(null);
  const [error, setError] = useState("");
  const { copy, Toast } = useCopyToast();

  const decode = () => {
    try {
      setError("");
      setResult(decodeJwt(input));
    } catch (e: unknown) {
      setError((e as Error).message);
      setResult(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">JWT Decoder</h1>
      <p className="text-[var(--muted)] mb-6">Decode and inspect JSON Web Tokens. View header, payload, and expiration status.</p>
      <div className="mb-4">
        <label className="text-sm text-[var(--muted)] mb-1 block">Paste JWT</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." rows={4} spellCheck={false} />
      </div>
      <button onClick={decode} className="btn mb-6">Decode</button>

      {error && <div className="p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-sm mb-4">{error}</div>}

      {result && (
        <div className="space-y-4">
          {result.expInfo && (
            <div className={`p-3 rounded-lg text-sm font-mono ${result.expInfo.includes("valid") ? "bg-green-950/50 border border-green-800 text-green-400" : "bg-yellow-950/50 border border-yellow-800 text-yellow-400"}`}>
              {result.expInfo}
            </div>
          )}
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[var(--accent)]">Header</span>
              <button onClick={() => copy(JSON.stringify(result.header, null, 2))} className="text-xs text-[var(--accent)] hover:underline">Copy</button>
            </div>
            <pre className="font-mono text-sm text-[var(--muted)] whitespace-pre-wrap break-all">{JSON.stringify(result.header, null, 2)}</pre>
          </div>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[var(--accent)]">Payload</span>
              <button onClick={() => copy(JSON.stringify(result.payload, null, 2))} className="text-xs text-[var(--accent)] hover:underline">Copy</button>
            </div>
            <pre className="font-mono text-sm text-[var(--muted)] whitespace-pre-wrap break-all">{JSON.stringify(result.payload, null, 2)}</pre>
          </div>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
            <span className="text-sm font-semibold text-[var(--accent)]">Signature</span>
            <div className="font-mono text-xs text-[var(--muted)] break-all mt-1">{result.signature}</div>
          </div>
        </div>
      )}
      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About JWTs</h2>
        <p>JSON Web Tokens (JWT) are compact, URL-safe tokens used for authentication and information exchange. A JWT has three parts: header (algorithm info), payload (claims), and signature. This decoder shows all parts and checks the expiration claim.</p>
      </section>
      <Toast />
    </div>
  );
}
