"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

export default function MetaTagGeneratorPage() {
  const { copy, Toast } = useCopyToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [canonical, setCanonical] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [viewport, setViewport] = useState("width=device-width, initial-scale=1");

  // Open Graph
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogUrl, setOgUrl] = useState("");
  const [ogType, setOgType] = useState("website");
  const [ogSiteName, setOgSiteName] = useState("");

  // Twitter
  const [twCard, setTwCard] = useState("summary_large_image");
  const [twSite, setTwSite] = useState("");
  const [twCreator, setTwCreator] = useState("");

  const generatedHTML = useMemo(() => {
    const lines: string[] = [];
    if (title) lines.push(`<title>${esc(title)}</title>`);
    if (description) lines.push(`<meta name="description" content="${esc(description)}" />`);
    if (keywords) lines.push(`<meta name="keywords" content="${esc(keywords)}" />`);
    if (author) lines.push(`<meta name="author" content="${esc(author)}" />`);
    if (viewport) lines.push(`<meta name="viewport" content="${esc(viewport)}" />`);
    if (robots) lines.push(`<meta name="robots" content="${esc(robots)}" />`);
    if (canonical) lines.push(`<link rel="canonical" href="${esc(canonical)}" />`);

    // OG
    const ot = ogTitle || title;
    const od = ogDescription || description;
    if (ot) lines.push(`<meta property="og:title" content="${esc(ot)}" />`);
    if (od) lines.push(`<meta property="og:description" content="${esc(od)}" />`);
    if (ogImage) lines.push(`<meta property="og:image" content="${esc(ogImage)}" />`);
    if (ogUrl || canonical) lines.push(`<meta property="og:url" content="${esc(ogUrl || canonical)}" />`);
    if (ogType) lines.push(`<meta property="og:type" content="${esc(ogType)}" />`);
    if (ogSiteName) lines.push(`<meta property="og:site_name" content="${esc(ogSiteName)}" />`);

    // Twitter
    if (twCard) lines.push(`<meta name="twitter:card" content="${esc(twCard)}" />`);
    if (ot) lines.push(`<meta name="twitter:title" content="${esc(ot)}" />`);
    if (od) lines.push(`<meta name="twitter:description" content="${esc(od)}" />`);
    if (ogImage) lines.push(`<meta name="twitter:image" content="${esc(ogImage)}" />`);
    if (twSite) lines.push(`<meta name="twitter:site" content="${esc(twSite)}" />`);
    if (twCreator) lines.push(`<meta name="twitter:creator" content="${esc(twCreator)}" />`);

    return lines.join("\n");
  }, [title, description, keywords, author, canonical, robots, viewport, ogTitle, ogDescription, ogImage, ogUrl, ogType, ogSiteName, twCard, twSite, twCreator]);

  function esc(s: string) {
    return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--surface)",
    color: "var(--foreground)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 14,
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
  };

  const sectionTitle = (text: string) => (
    <h3 style={{ fontWeight: 600, fontSize: 15, margin: "16px 0 8px", color: "var(--foreground)" }}>{text}</h3>
  );

  return (
    <main className="tool-container">
      <h1 className="tool-title">Meta Tag Generator</h1>
      <p className="tool-desc">
        Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Fill in the fields and copy the generated code.
      </p>

      {/* Basic SEO */}
      {sectionTitle("Basic SEO")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Page Title {title && <span>({title.length}/60)</span>}</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Page" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Author</span>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="John Doe" style={inputStyle} />
        </label>
      </div>
      <label style={{ ...labelStyle, marginTop: 12 }}>
        <span style={{ color: "var(--muted)" }}>
          Description {description && <span>({description.length}/160)</span>}
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of the page..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Keywords (comma-separated)</span>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="web, tools, seo" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Canonical URL</span>
          <input type="text" value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="https://example.com/page" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Robots</span>
          <select value={robots} onChange={(e) => setRobots(e.target.value)} style={inputStyle}>
            <option value="index, follow">index, follow</option>
            <option value="noindex, follow">noindex, follow</option>
            <option value="index, nofollow">index, nofollow</option>
            <option value="noindex, nofollow">noindex, nofollow</option>
          </select>
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Viewport</span>
          <input type="text" value={viewport} onChange={(e) => setViewport(e.target.value)} style={inputStyle} />
        </label>
      </div>

      {/* Open Graph */}
      {sectionTitle("Open Graph")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>OG Title (defaults to page title)</span>
          <input type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>OG Type</span>
          <select value={ogType} onChange={(e) => setOgType(e.target.value)} style={inputStyle}>
            <option value="website">website</option>
            <option value="article">article</option>
            <option value="product">product</option>
            <option value="profile">profile</option>
          </select>
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>OG Image URL</span>
          <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/image.jpg" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>OG URL</span>
          <input type="text" value={ogUrl} onChange={(e) => setOgUrl(e.target.value)} placeholder="https://example.com" style={inputStyle} />
        </label>
        <label style={{ ...labelStyle, gridColumn: "span 2" }}>
          <span style={{ color: "var(--muted)" }}>OG Description (defaults to description)</span>
          <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Site Name</span>
          <input type="text" value={ogSiteName} onChange={(e) => setOgSiteName(e.target.value)} placeholder="My Website" style={inputStyle} />
        </label>
      </div>

      {/* Twitter Card */}
      {sectionTitle("Twitter Card")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>Card Type</span>
          <select value={twCard} onChange={(e) => setTwCard(e.target.value)} style={inputStyle}>
            <option value="summary">summary</option>
            <option value="summary_large_image">summary_large_image</option>
            <option value="app">app</option>
            <option value="player">player</option>
          </select>
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>@site</span>
          <input type="text" value={twSite} onChange={(e) => setTwSite(e.target.value)} placeholder="@yoursite" style={inputStyle} />
        </label>
        <label style={labelStyle}>
          <span style={{ color: "var(--muted)" }}>@creator</span>
          <input type="text" value={twCreator} onChange={(e) => setTwCreator(e.target.value)} placeholder="@author" style={inputStyle} />
        </label>
      </div>

      {/* Search Preview */}
      {(title || description) && (
        <>
          {sectionTitle("Google Search Preview")}
          <div
            style={{
              background: "var(--surface)",
              borderRadius: 8,
              border: "1px solid var(--border)",
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ color: "#1a0dab", fontSize: 18, fontWeight: 400, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title || "Page Title"}
            </div>
            <div style={{ color: "#006621", fontSize: 13, marginBottom: 4 }}>
              {canonical || "https://example.com/page"}
            </div>
            <div style={{ color: "var(--muted)", fontSize: 13, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {description || "Page description will appear here..."}
            </div>
          </div>
        </>
      )}

      {/* Generated HTML */}
      {sectionTitle("Generated HTML")}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 8,
          border: "1px solid var(--border)",
          padding: 16,
          fontFamily: "monospace",
          fontSize: 13,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          marginBottom: 12,
          minHeight: 60,
          maxHeight: 400,
          overflowY: "auto",
        }}
      >
        {generatedHTML || "Fill in the fields above to generate meta tags..."}
      </div>

      <button className="btn" onClick={() => copy(generatedHTML)} disabled={!generatedHTML}>
        Copy HTML
      </button>

      <Toast />
    </main>
  );
}
