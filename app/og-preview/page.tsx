"use client";
import { useState } from "react";

export default function OgPreviewPage() {
  const [title, setTitle] = useState("DevKit – Free Developer Tools");
  const [description, setDescription] = useState("Fast, free, privacy-first utilities that run entirely in your browser. No data leaves your machine.");
  const [image, setImage] = useState("https://tools.elunari.uk/icon.svg");
  const [url, setUrl] = useState("https://tools.elunari.uk");
  const [siteName, setSiteName] = useState("DevKit");

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)",
    borderRadius: 6, padding: "8px 10px", fontSize: 14, width: "100%",
  };

  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max) + "..." : s;

  return (
    <main className="tool-container">
      <h1 className="tool-title">Open Graph Preview</h1>
      <p className="tool-desc">Preview how your page looks when shared on social media. Edit meta tag values and see live previews for different platforms.</p>

      {/* Input fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>og:title</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>og:description</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ ...inputStyle, fontFamily: "inherit" }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
          <span style={{ color: "var(--muted)" }}>og:image (URL)</span>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={inputStyle} />
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>og:url</span>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
            <span style={{ color: "var(--muted)" }}>og:site_name</span>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} style={inputStyle} />
          </label>
        </div>
      </div>

      {/* Previews */}
      <h3 style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Social Media Previews</h3>

      {/* Facebook / LinkedIn */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Facebook / LinkedIn</div>
        <div style={{
          border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden",
          maxWidth: 500, background: "var(--surface)",
        }}>
          {image && (
            <div style={{
              width: "100%", height: 260, background: "#1a1a2e",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="OG" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          )}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
              {url ? new URL(url).hostname : "example.com"}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, marginTop: 2, lineHeight: 1.3 }}>{truncate(title, 65)}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, lineHeight: 1.4 }}>{truncate(description, 155)}</div>
          </div>
        </div>
      </div>

      {/* Twitter */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Twitter (X) — Large Image Card</div>
        <div style={{
          border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden",
          maxWidth: 500, background: "var(--surface)",
        }}>
          {image && (
            <div style={{
              width: "100%", height: 250, background: "#1a1a2e",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Twitter" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          )}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{truncate(title, 70)}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2, lineHeight: 1.3 }}>{truncate(description, 125)}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              &#128279; {url ? new URL(url).hostname : "example.com"}
            </div>
          </div>
        </div>
      </div>

      {/* Google Search */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Google Search Result</div>
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
          padding: 16, maxWidth: 600,
        }}>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>
            {url || "https://example.com"} &rsaquo;
          </div>
          <div style={{ fontSize: 18, color: "#8ab4f8", fontWeight: 400, marginBottom: 4, cursor: "pointer" }}>
            {truncate(title, 60)}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
            {truncate(description, 160)}
          </div>
        </div>
      </div>

      {/* Slack */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Slack</div>
        <div style={{
          borderLeft: "4px solid var(--accent)", paddingLeft: 12,
          maxWidth: 500,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 2 }}>{siteName || "Website"}</div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#8ab4f8", marginBottom: 2 }}>{truncate(title, 60)}</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{truncate(description, 155)}</div>
          {image && (
            <div style={{ marginTop: 8, maxWidth: 360, borderRadius: 4, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Slack" style={{ maxWidth: "100%", maxHeight: 200 }}
                onError={(e) => { e.currentTarget.style.display = "none"; }} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
