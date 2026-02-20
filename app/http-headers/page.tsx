"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

type Category = "general" | "request" | "response" | "entity" | "security" | "caching" | "cors";

interface Header {
  name: string;
  desc: string;
  example: string;
  category: Category;
}

const HEADERS: Header[] = [
  { name: "Accept", desc: "Media types the client can process", example: "Accept: text/html, application/json", category: "request" },
  { name: "Accept-Charset", desc: "Character sets the client supports", example: "Accept-Charset: utf-8, iso-8859-1", category: "request" },
  { name: "Accept-Encoding", desc: "Content encodings the client supports", example: "Accept-Encoding: gzip, deflate, br", category: "request" },
  { name: "Accept-Language", desc: "Natural languages preferred by the client", example: "Accept-Language: en-US, en;q=0.9", category: "request" },
  { name: "Authorization", desc: "Credentials for authenticating with the server", example: "Authorization: Bearer eyJhbGci...", category: "request" },
  { name: "Cache-Control", desc: "Directives for caching mechanisms", example: "Cache-Control: no-cache, no-store, must-revalidate", category: "caching" },
  { name: "Connection", desc: "Control options for the current connection", example: "Connection: keep-alive", category: "general" },
  { name: "Content-Disposition", desc: "How content should be displayed (inline or attachment)", example: "Content-Disposition: attachment; filename=\"file.pdf\"", category: "entity" },
  { name: "Content-Encoding", desc: "Encoding applied to the message body", example: "Content-Encoding: gzip", category: "entity" },
  { name: "Content-Language", desc: "Natural language of the response body", example: "Content-Language: en-US", category: "entity" },
  { name: "Content-Length", desc: "Size of the message body in bytes", example: "Content-Length: 348", category: "entity" },
  { name: "Content-Type", desc: "Media type of the message body", example: "Content-Type: application/json; charset=utf-8", category: "entity" },
  { name: "Cookie", desc: "HTTP cookies previously sent by the server", example: "Cookie: session_id=abc123; theme=dark", category: "request" },
  { name: "Date", desc: "Date and time the message was sent", example: "Date: Tue, 15 Nov 2023 08:12:31 GMT", category: "general" },
  { name: "ETag", desc: "Identifier for a specific version of a resource", example: "ETag: \"33a64df551425fcc55e4d42a148795d9f25f89d4\"", category: "caching" },
  { name: "Expires", desc: "Date/time after which the response is stale", example: "Expires: Thu, 01 Dec 2023 16:00:00 GMT", category: "caching" },
  { name: "Host", desc: "Domain name and port of the server", example: "Host: www.example.com", category: "request" },
  { name: "If-Match", desc: "Conditional request based on ETag", example: "If-Match: \"bfc13a64729c4290ef5b2c2730249c88ca92d82d\"", category: "caching" },
  { name: "If-Modified-Since", desc: "Conditional request based on last modification date", example: "If-Modified-Since: Sat, 29 Oct 2023 19:43:31 GMT", category: "caching" },
  { name: "If-None-Match", desc: "Conditional request based on ETag (negative)", example: "If-None-Match: \"33a64df551425fcc55e4\"", category: "caching" },
  { name: "Last-Modified", desc: "Date the resource was last modified", example: "Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT", category: "caching" },
  { name: "Location", desc: "URL to redirect to", example: "Location: https://www.example.com/new-page", category: "response" },
  { name: "Origin", desc: "Origin of the request (scheme, host, port)", example: "Origin: https://www.example.com", category: "cors" },
  { name: "Pragma", desc: "Implementation-specific directives (legacy)", example: "Pragma: no-cache", category: "caching" },
  { name: "Referer", desc: "URL of the page that linked to the resource", example: "Referer: https://www.example.com/page", category: "request" },
  { name: "Retry-After", desc: "How long to wait before making another request", example: "Retry-After: 120", category: "response" },
  { name: "Server", desc: "Information about the server software", example: "Server: nginx/1.25.3", category: "response" },
  { name: "Set-Cookie", desc: "Send cookies from the server to the client", example: "Set-Cookie: id=a3fWa; Expires=Thu, 31 Oct 2024; Secure; HttpOnly", category: "response" },
  { name: "Strict-Transport-Security", desc: "Force HTTPS connections (HSTS)", example: "Strict-Transport-Security: max-age=63072000; includeSubDomains", category: "security" },
  { name: "Transfer-Encoding", desc: "Encoding used to transfer the message body", example: "Transfer-Encoding: chunked", category: "general" },
  { name: "User-Agent", desc: "Client application identifier", example: "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)", category: "request" },
  { name: "Vary", desc: "Headers used to determine cached response validity", example: "Vary: Accept-Encoding, User-Agent", category: "caching" },
  { name: "WWW-Authenticate", desc: "Authentication method for accessing the resource", example: "WWW-Authenticate: Bearer realm=\"example\"", category: "response" },
  { name: "X-Content-Type-Options", desc: "Prevent MIME type sniffing", example: "X-Content-Type-Options: nosniff", category: "security" },
  { name: "X-Frame-Options", desc: "Control whether page can be loaded in a frame", example: "X-Frame-Options: DENY", category: "security" },
  { name: "X-XSS-Protection", desc: "Enable cross-site scripting filter (legacy)", example: "X-XSS-Protection: 1; mode=block", category: "security" },
  { name: "Content-Security-Policy", desc: "Control resources the browser can load", example: "Content-Security-Policy: default-src 'self'; script-src 'self'", category: "security" },
  { name: "Access-Control-Allow-Origin", desc: "Origins allowed to access the resource", example: "Access-Control-Allow-Origin: *", category: "cors" },
  { name: "Access-Control-Allow-Methods", desc: "HTTP methods allowed for CORS requests", example: "Access-Control-Allow-Methods: GET, POST, PUT, DELETE", category: "cors" },
  { name: "Access-Control-Allow-Headers", desc: "Headers allowed in CORS requests", example: "Access-Control-Allow-Headers: Content-Type, Authorization", category: "cors" },
  { name: "Access-Control-Max-Age", desc: "How long CORS preflight results can be cached", example: "Access-Control-Max-Age: 86400", category: "cors" },
  { name: "Access-Control-Expose-Headers", desc: "Headers exposed to CORS responses", example: "Access-Control-Expose-Headers: X-Request-Id", category: "cors" },
  { name: "X-Forwarded-For", desc: "Client IP when behind a proxy", example: "X-Forwarded-For: 203.0.113.50, 70.41.3.18", category: "request" },
  { name: "X-Forwarded-Proto", desc: "Protocol used by the client (behind proxy)", example: "X-Forwarded-Proto: https", category: "request" },
  { name: "X-Request-Id", desc: "Unique identifier for the request (tracing)", example: "X-Request-Id: f058ebd6-02f7-4d3f-942e-904344e8cde5", category: "general" },
  { name: "Accept-Ranges", desc: "Whether server supports range requests", example: "Accept-Ranges: bytes", category: "response" },
  { name: "Range", desc: "Request only part of a resource", example: "Range: bytes=200-1000", category: "request" },
];

const CATEGORY_LABELS: Record<Category, string> = {
  general: "General",
  request: "Request",
  response: "Response",
  entity: "Entity / Representation",
  security: "Security",
  caching: "Caching",
  cors: "CORS",
};

const CATEGORY_COLORS: Record<Category, string> = {
  general: "#6b7280",
  request: "#3b82f6",
  response: "#10b981",
  entity: "#f59e0b",
  security: "#ef4444",
  caching: "#8b5cf6",
  cors: "#06b6d4",
};

export default function HttpHeadersPage() {
  const { copy, Toast } = useCopyToast();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    return HEADERS.filter((h) => {
      const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "all" || h.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [search, selectedCategory]);

  return (
    <main className="tool-container">
      <h1 className="tool-title">HTTP Headers Reference</h1>
      <p className="tool-desc">Complete reference of common HTTP request and response headers with descriptions and examples.</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search headers..."
          style={{
            flex: 1, minWidth: 200, background: "var(--surface)", color: "var(--foreground)",
            border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", fontSize: 14,
          }}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as Category | "all")}
          style={{
            background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
            borderRadius: 6, padding: "8px 10px", fontSize: 14,
          }}>
          <option value="all">All categories ({HEADERS.length})</option>
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]} ({HEADERS.filter((h) => h.category === cat).length})</option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{filtered.length} header{filtered.length !== 1 ? "s" : ""}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((h) => (
          <div key={h.name} style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "12px 16px", borderLeft: `3px solid ${CATEGORY_COLORS[h.category]}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15 }}>{h.name}</span>
                <span style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 4,
                  background: CATEGORY_COLORS[h.category] + "22", color: CATEGORY_COLORS[h.category],
                }}>{CATEGORY_LABELS[h.category]}</span>
              </div>
              <button className="btn btn-secondary" onClick={() => copy(h.example)} style={{ fontSize: 11, padding: "3px 8px" }}>Copy example</button>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{h.desc}</div>
            <code style={{
              fontSize: 12, fontFamily: "monospace", color: "var(--foreground)", opacity: 0.8,
              background: "var(--background)", padding: "4px 8px", borderRadius: 4, display: "inline-block",
              wordBreak: "break-all",
            }}>{h.example}</code>
          </div>
        ))}
      </div>

      <Toast />
    </main>
  );
}
