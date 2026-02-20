"use client";
import { useState, useCallback } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const SAMPLE = `{
  "name": "DevKit",
  "version": "1.0.0",
  "tools": 60,
  "features": ["free", "privacy-first", "client-side"],
  "config": {
    "framework": "Next.js",
    "hosting": "Vercel",
    "domain": "tools.elunari.uk"
  },
  "analytics": null,
  "active": true
}`;

function TreeNode({ name, value, path, expanded, toggleExpand, copyPath }: {
  name: string;
  value: unknown;
  path: string;
  expanded: Set<string>;
  toggleExpand: (p: string) => void;
  copyPath: (p: string) => void;
}) {
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const isExpanded = expanded.has(path);
  const entries = isObject ? Object.entries(value as Record<string, unknown>) : [];

  const typeColor = (v: unknown): string => {
    if (v === null) return "#ef4444";
    if (typeof v === "string") return "#22c55e";
    if (typeof v === "number") return "#3b82f6";
    if (typeof v === "boolean") return "#f59e0b";
    return "var(--foreground)";
  };

  const renderValue = (v: unknown): string => {
    if (v === null) return "null";
    if (typeof v === "string") return `"${v}"`;
    return String(v);
  };

  return (
    <div style={{ marginLeft: name === "root" ? 0 : 16 }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 0", cursor: isObject ? "pointer" : "default" }}
        onClick={() => isObject && toggleExpand(path)}
      >
        {isObject && (
          <span style={{ width: 16, textAlign: "center", fontSize: 11, color: "var(--muted)", userSelect: "none" }}>
            {isExpanded ? "\u25BC" : "\u25B6"}
          </span>
        )}
        {!isObject && <span style={{ width: 16 }} />}
        <span style={{ fontWeight: 600, fontSize: 13, color: "var(--accent)" }}>{name}</span>
        <span style={{ color: "var(--muted)", fontSize: 12 }}>:</span>
        {isObject ? (
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {isArray ? `Array[${entries.length}]` : `Object{${entries.length}}`}
          </span>
        ) : (
          <span style={{ fontSize: 13, color: typeColor(value) }}>{renderValue(value)}</span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); copyPath(path); }}
          style={{
            marginLeft: 6, fontSize: 10, padding: "1px 4px", background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: 3, color: "var(--muted)",
            cursor: "pointer", opacity: 0.5,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          path
        </button>
      </div>
      {isObject && isExpanded && entries.map(([k, v]) => (
        <TreeNode key={k} name={k} value={v} path={`${path}.${k}`}
          expanded={expanded} toggleExpand={toggleExpand} copyPath={copyPath} />
      ))}
    </div>
  );
}

export default function JsonTreeViewerPage() {
  const { copy, Toast } = useCopyToast();
  const [input, setInput] = useState(SAMPLE);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]));
  const [error, setError] = useState("");

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(input);
    if (error) setError("");
  } catch (e) {
    if (!error) setError((e as Error).message);
  }

  const toggleExpand = useCallback((path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expandAll = () => {
    if (!parsed) return;
    const paths = new Set<string>();
    const walk = (obj: unknown, path: string) => {
      if (obj !== null && typeof obj === "object") {
        paths.add(path);
        Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => walk(v, `${path}.${k}`));
      }
    };
    walk(parsed, "root");
    setExpanded(paths);
  };

  const collapseAll = () => setExpanded(new Set(["root"]));

  const copyPath = (path: string) => {
    const jsonPath = path.replace(/^root\.?/, "$").replace(/\.(\d+)/g, "[$1]");
    copy(jsonPath || "$");
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">JSON Tree Viewer</h1>
      <p className="tool-desc">Paste JSON to explore it as a collapsible interactive tree. Click paths to copy JSONPath.</p>

      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} spellCheck={false}
        placeholder="Paste JSON here..."
        style={{
          width: "100%", fontFamily: "monospace", fontSize: 13, resize: "vertical",
          background: "var(--surface)", color: "var(--foreground)",
          border: "1px solid var(--border)", borderRadius: 8, padding: 12, marginBottom: 8,
        }} />

      {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>{error}</div>}

      {parsed !== null && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button className="btn btn-secondary" onClick={expandAll} style={{ fontSize: 12 }}>Expand All</button>
            <button className="btn btn-secondary" onClick={collapseAll} style={{ fontSize: 12 }}>Collapse All</button>
          </div>

          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
            padding: 14, overflow: "auto", maxHeight: 500,
          }}>
            <TreeNode name="root" value={parsed} path="root"
              expanded={expanded} toggleExpand={toggleExpand} copyPath={copyPath} />
          </div>
        </>
      )}

      <Toast />
    </main>
  );
}
