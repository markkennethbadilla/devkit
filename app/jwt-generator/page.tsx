"use client";
import { useState, useCallback, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

// Base64url encode
function b64url(data: Uint8Array): string {
  let s = "";
  for (let i = 0; i < data.length; i++) s += String.fromCharCode(data[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlStr(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSHA256(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return b64url(new Uint8Array(sig));
}

export default function JWTGeneratorPage() {
  const { copy, Toast } = useCopyToast();

  const [secret, setSecret] = useState("your-256-bit-secret");
  const [algorithm] = useState("HS256");

  // Payload fields
  const [sub, setSub] = useState("1234567890");
  const [name, setName] = useState("John Doe");
  const [iss, setIss] = useState("");
  const [aud, setAud] = useState("");
  const [exp, setExp] = useState("");
  const [iat, setIat] = useState("");
  const [nbf, setNbf] = useState("");
  const [jti, setJti] = useState("");
  const [customClaims, setCustomClaims] = useState("");

  const [jwt, setJwt] = useState("");
  const [error, setError] = useState("");

  const header = useMemo(() => JSON.stringify({ alg: algorithm, typ: "JWT" }), [algorithm]);

  const payload = useMemo(() => {
    const obj: Record<string, unknown> = {};
    if (sub) obj.sub = sub;
    if (name) obj.name = name;
    if (iss) obj.iss = iss;
    if (aud) obj.aud = aud;
    if (iat) obj.iat = Number(iat);
    if (exp) obj.exp = Number(exp);
    if (nbf) obj.nbf = Number(nbf);
    if (jti) obj.jti = jti;

    // Parse custom claims
    if (customClaims.trim()) {
      try {
        const custom = JSON.parse(customClaims);
        if (typeof custom === "object" && custom !== null) {
          Object.assign(obj, custom);
        }
      } catch {
        // ignore parse error for display
      }
    }

    return JSON.stringify(obj, null, 2);
  }, [sub, name, iss, aud, exp, iat, nbf, jti, customClaims]);

  const generateJWT = useCallback(async () => {
    try {
      setError("");
      const headerB64 = b64urlStr(header);
      const payloadB64 = b64urlStr(payload);
      const dataToSign = `${headerB64}.${payloadB64}`;
      const signature = await hmacSHA256(secret, dataToSign);
      setJwt(`${dataToSign}.${signature}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate JWT");
    }
  }, [header, payload, secret]);

  const setIatNow = () => setIat(String(Math.floor(Date.now() / 1000)));
  const setExpFromNow = (hours: number) =>
    setExp(String(Math.floor(Date.now() / 1000) + hours * 3600));

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 14,
    width: "100%",
    fontFamily: "monospace",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">JWT Generator</h1>
      <p className="tool-desc">
        Create signed JSON Web Tokens with HMAC-SHA256. Set standard claims and add custom ones.
      </p>

      {/* Secret */}
      <label style={{ ...labelStyle, marginBottom: 16 }}>
        <span style={{ color: "var(--muted)" }}>Secret Key (HMAC-SHA256)</span>
        <input
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          style={inputStyle}
        />
      </label>

      {/* Standard claims */}
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Standard Claims</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>sub (Subject)</span>
          <input type="text" value={sub} onChange={(e) => setSub(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>iss (Issuer)</span>
          <input type="text" value={iss} onChange={(e) => setIss(e.target.value)} placeholder="https://example.com" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>aud (Audience)</span>
          <input type="text" value={aud} onChange={(e) => setAud(e.target.value)} placeholder="https://api.example.com" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>iat (Issued At)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={iat} onChange={(e) => setIat(e.target.value)} placeholder="Unix timestamp" style={{ ...inputStyle, flex: 1 }} />
            <button className="btn btn-secondary" onClick={setIatNow} style={{ fontSize: 12, whiteSpace: "nowrap" }}>Now</button>
          </div>
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>exp (Expiration)</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="text" value={exp} onChange={(e) => setExp(e.target.value)} placeholder="Unix timestamp" style={{ ...inputStyle, flex: 1 }} />
            <button className="btn btn-secondary" onClick={() => setExpFromNow(1)} style={{ fontSize: 12, whiteSpace: "nowrap" }}>+1h</button>
            <button className="btn btn-secondary" onClick={() => setExpFromNow(24)} style={{ fontSize: 12, whiteSpace: "nowrap" }}>+24h</button>
          </div>
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>nbf (Not Before)</span>
          <input type="text" value={nbf} onChange={(e) => setNbf(e.target.value)} placeholder="Unix timestamp" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>jti (JWT ID)</span>
          <input type="text" value={jti} onChange={(e) => setJti(e.target.value)} placeholder="unique-id" style={inputStyle} />
        </label>
      </div>

      {/* Custom Claims */}
      <label style={{ ...labelStyle, marginBottom: 16 }}>
        <span style={{ color: "var(--muted)" }}>Custom Claims (JSON object, merged into payload)</span>
        <textarea
          value={customClaims}
          onChange={(e) => setCustomClaims(e.target.value)}
          placeholder={'{"role": "admin", "permissions": ["read", "write"]}'}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>

      {/* Generate button */}
      <button className="btn" onClick={generateJWT} style={{ marginBottom: 16 }}>
        Generate JWT
      </button>

      {error && (
        <div style={{ color: "#ef4444", fontSize: 14, marginBottom: 12 }}>{error}</div>
      )}

      {/* Header & Payload preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: "var(--muted)" }}>Header</h3>
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 8,
              border: "1px solid var(--border)",
              padding: 12,
              fontFamily: "monospace",
              fontSize: 13,
              whiteSpace: "pre",
            }}
          >
            {JSON.stringify(JSON.parse(header), null, 2)}
          </div>
        </div>
        <div>
          <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8, color: "var(--muted)" }}>Payload</h3>
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 8,
              border: "1px solid var(--border)",
              padding: 12,
              fontFamily: "monospace",
              fontSize: 13,
              whiteSpace: "pre",
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {payload}
          </div>
        </div>
      </div>

      {/* JWT Output */}
      {jwt && (
        <>
          <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Generated Token</h3>
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 8,
              border: "1px solid var(--border)",
              padding: 16,
              fontFamily: "monospace",
              fontSize: 12,
              wordBreak: "break-all",
              marginBottom: 12,
            }}
          >
            {jwt.split(".").map((part, i) => (
              <span key={i} style={{ color: i === 0 ? "#ef4444" : i === 1 ? "#a855f7" : "#22c55e" }}>
                {part}
                {i < 2 ? "." : ""}
              </span>
            ))}
          </div>
          <button className="btn" onClick={() => copy(jwt)}>
            Copy JWT
          </button>
        </>
      )}

      <Toast />
    </main>
  );
}
