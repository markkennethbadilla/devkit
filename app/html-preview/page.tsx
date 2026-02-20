"use client";
import { useState, useRef, useEffect } from "react";

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #1a1a2e; color: #e94560; }
    .card { background: #16213e; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
    h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
    p { margin: 0; color: #a8a8b3; font-size: 0.9rem; }
    button { margin-top: 1rem; padding: 0.5rem 1.5rem; background: #e94560; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
    button:hover { background: #c73651; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, DevKit!</h1>
    <p>Edit this code and see live changes.</p>
    <button onclick="document.querySelector('h1').textContent='It works!'">Click me</button>
  </div>
</body>
</html>`;

export default function HtmlPreviewPage() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updatePreview = (code: string) => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(code);
      doc.close();
    }
  };

  useEffect(() => {
    if (!autoRefresh) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updatePreview(html), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [html, autoRefresh]);

  useEffect(() => {
    updatePreview(html);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="tool-container">
      <h1 className="tool-title">Live HTML Preview</h1>
      <p className="tool-desc">Write HTML, CSS, and JavaScript and see the result instantly. A quick sandbox for prototyping.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
          <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
          <span style={{ color: "var(--muted)" }}>Auto-refresh</span>
        </label>
        {!autoRefresh && (
          <button className="btn" onClick={() => updatePreview(html)} style={{ fontSize: 12 }}>Run</button>
        )}
        <button className="btn btn-secondary" onClick={() => { setHtml(SAMPLE_HTML); updatePreview(SAMPLE_HTML); }} style={{ fontSize: 12, marginLeft: "auto" }}>Reset</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, minHeight: 400 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>HTML / CSS / JS</div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            style={{
              flex: 1, background: "var(--surface)", color: "var(--foreground)",
              border: "1px solid var(--border)", borderRadius: 6, padding: "10px",
              fontSize: 13, fontFamily: "monospace", resize: "none", minHeight: 380,
            }}
            spellCheck={false}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Preview</div>
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts"
            style={{
              flex: 1, border: "1px solid var(--border)", borderRadius: 6,
              background: "#fff", minHeight: 380,
            }}
            title="HTML Preview"
          />
        </div>
      </div>
    </main>
  );
}
