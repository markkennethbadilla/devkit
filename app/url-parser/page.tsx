"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface ParsedUrl {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  host: string;
  params: [string, string][];
  error?: string;
}

function parseUrl(input: string): ParsedUrl {
  const empty: ParsedUrl = { protocol: "", username: "", password: "", hostname: "", port: "", pathname: "", search: "", hash: "", origin: "", host: "", params: [] };
  if (!input.trim()) return empty;
  try {
    const u = new URL(input);
    return {
      protocol: u.protocol,
      username: u.username,
      password: u.password,
      hostname: u.hostname,
      port: u.port,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      origin: u.origin,
      host: u.host,
      params: [...u.searchParams.entries()],
    };
  } catch {
    try {
      const u = new URL("https://" + input);
      return {
        protocol: u.protocol,
        username: u.username,
        password: u.password,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        origin: u.origin,
        host: u.host,
        params: [...u.searchParams.entries()],
        error: "Added https:// prefix to parse",
      };
    } catch {
      return { ...empty, error: "Invalid URL" };
    }
  }
}

export default function UrlParserPage() {
  const { copy, Toast } = useCopyToast();
  const [input, setInput] = useState("https://user:pass@example.com:8080/path/to/page?q=hello&lang=en&page=1#section-2");

  const parsed = useMemo(() => parseUrl(input), [input]);

  const fields: { label: string; value: string; key: keyof ParsedUrl }[] = [
    { label: "Protocol", value: parsed.protocol, key: "protocol" },
    { label: "Username", value: parsed.username, key: "username" },
    { label: "Password", value: parsed.password, key: "password" },
    { label: "Hostname", value: parsed.hostname, key: "hostname" },
    { label: "Port", value: parsed.port, key: "port" },
    { label: "Origin", value: parsed.origin, key: "origin" },
    { label: "Host", value: parsed.host, key: "host" },
    { label: "Pathname", value: parsed.pathname, key: "pathname" },
    { label: "Search", value: parsed.search, key: "search" },
    { label: "Hash", value: parsed.hash, key: "hash" },
  ];

  return (
    <main className="tool-container">
      <h1 className="tool-title">URL Parser</h1>
      <p className="tool-desc">Break down URLs into their components: protocol, host, path, query parameters, and more.</p>

      <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a URL to parse..."
        style={{
          width: "100%", background: "var(--surface)", color: "var(--foreground)",
          border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px",
          fontSize: 14, fontFamily: "monospace", marginBottom: 12,
        }} />

      {parsed.error && (
        <div style={{ fontSize: 13, color: parsed.error.startsWith("Added") ? "var(--muted)" : "#ef4444", marginBottom: 12 }}>
          {parsed.error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
        {fields.filter((f) => f.value).map((f) => (
          <div key={f.key} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
            padding: "6px 12px",
          }}>
            <span style={{ fontSize: 12, color: "var(--muted)", minWidth: 80, fontWeight: 600 }}>{f.label}</span>
            <code style={{ fontSize: 13, fontFamily: "monospace", flex: 1, color: "var(--accent)" }}>{f.value}</code>
            <button className="btn btn-secondary" onClick={() => copy(f.value)}
              style={{ fontSize: 10, padding: "2px 6px" }}>Copy</button>
          </div>
        ))}
      </div>

      {parsed.params.length > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Query Parameters ({parsed.params.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {parsed.params.map(([key, val], i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
                padding: "6px 12px",
              }}>
                <code style={{ fontSize: 13, fontFamily: "monospace", fontWeight: 600, color: "var(--foreground)", minWidth: 100 }}>{key}</code>
                <span style={{ color: "var(--muted)" }}>=</span>
                <code style={{ fontSize: 13, fontFamily: "monospace", flex: 1, color: "#22c55e" }}>{val}</code>
                <button className="btn btn-secondary" onClick={() => copy(val)}
                  style={{ fontSize: 10, padding: "2px 6px" }}>Copy</button>
              </div>
            ))}
          </div>
        </>
      )}

      <Toast />
    </main>
  );
}
