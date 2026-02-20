"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface EnvVar {
  key: string;
  value: string;
  comment: string;
  isSection: boolean;
}

const TEMPLATES: { name: string; vars: EnvVar[] }[] = [
  {
    name: "Next.js",
    vars: [
      { key: "", value: "", comment: "Next.js Environment", isSection: true },
      { key: "NEXT_PUBLIC_APP_URL", value: "http://localhost:3000", comment: "", isSection: false },
      { key: "NEXT_PUBLIC_API_URL", value: "http://localhost:3001/api", comment: "", isSection: false },
      { key: "", value: "", comment: "Database", isSection: true },
      { key: "DATABASE_URL", value: "postgresql://user:password@localhost:5432/mydb", comment: "", isSection: false },
      { key: "", value: "", comment: "Auth", isSection: true },
      { key: "NEXTAUTH_SECRET", value: "your-secret-here", comment: "", isSection: false },
      { key: "NEXTAUTH_URL", value: "http://localhost:3000", comment: "", isSection: false },
    ],
  },
  {
    name: "Node.js API",
    vars: [
      { key: "", value: "", comment: "Server", isSection: true },
      { key: "PORT", value: "3000", comment: "", isSection: false },
      { key: "NODE_ENV", value: "development", comment: "", isSection: false },
      { key: "", value: "", comment: "Database", isSection: true },
      { key: "DB_HOST", value: "localhost", comment: "", isSection: false },
      { key: "DB_PORT", value: "5432", comment: "", isSection: false },
      { key: "DB_NAME", value: "mydb", comment: "", isSection: false },
      { key: "DB_USER", value: "postgres", comment: "", isSection: false },
      { key: "DB_PASS", value: "", comment: "", isSection: false },
      { key: "", value: "", comment: "JWT", isSection: true },
      { key: "JWT_SECRET", value: "your-jwt-secret", comment: "", isSection: false },
      { key: "JWT_EXPIRES_IN", value: "7d", comment: "", isSection: false },
    ],
  },
  {
    name: "Docker",
    vars: [
      { key: "COMPOSE_PROJECT_NAME", value: "myproject", comment: "", isSection: false },
      { key: "POSTGRES_USER", value: "postgres", comment: "", isSection: false },
      { key: "POSTGRES_PASSWORD", value: "password", comment: "", isSection: false },
      { key: "POSTGRES_DB", value: "mydb", comment: "", isSection: false },
      { key: "REDIS_URL", value: "redis://redis:6379", comment: "", isSection: false },
    ],
  },
  {
    name: "AWS",
    vars: [
      { key: "AWS_ACCESS_KEY_ID", value: "", comment: "", isSection: false },
      { key: "AWS_SECRET_ACCESS_KEY", value: "", comment: "", isSection: false },
      { key: "AWS_REGION", value: "us-east-1", comment: "", isSection: false },
      { key: "AWS_S3_BUCKET", value: "my-bucket", comment: "", isSection: false },
    ],
  },
];

export default function EnvGeneratorPage() {
  const { copy, Toast } = useCopyToast();
  const [vars, setVars] = useState<EnvVar[]>([
    { key: "APP_NAME", value: "MyApp", comment: "", isSection: false },
    { key: "PORT", value: "3000", comment: "", isSection: false },
  ]);

  const addVar = () => setVars((prev) => [...prev, { key: "", value: "", comment: "", isSection: false }]);
  const addSection = () => setVars((prev) => [...prev, { key: "", value: "", comment: "Section", isSection: true }]);
  const removeVar = (idx: number) => setVars((prev) => prev.filter((_, i) => i !== idx));
  const updateVar = (idx: number, updates: Partial<EnvVar>) => {
    setVars((prev) => prev.map((v, i) => (i === idx ? { ...v, ...updates } : v)));
  };

  const envOutput = useMemo(() => {
    return vars.map((v) => {
      if (v.isSection) return `\n# ${v.comment || "Section"}`;
      let line = "";
      if (v.comment) line += `# ${v.comment}\n`;
      const needsQuotes = v.value.includes(" ") || v.value.includes("#") || v.value.includes("=");
      line += `${v.key}=${needsQuotes ? `"${v.value}"` : v.value}`;
      return line;
    }).join("\n").trim();
  }, [vars]);

  const importJson = () => {
    const json = prompt("Paste JSON object:");
    if (!json) return;
    try {
      const obj = JSON.parse(json);
      const newVars: EnvVar[] = Object.entries(obj).map(([k, v]) => ({
        key: k.toUpperCase(), value: String(v), comment: "", isSection: false,
      }));
      setVars(newVars);
    } catch { alert("Invalid JSON"); }
  };

  const envExample = useMemo(() => {
    return vars.filter((v) => !v.isSection).map((v) => {
      let line = "";
      if (v.comment) line += `# ${v.comment}\n`;
      line += `${v.key}=`;
      return line;
    }).join("\n").trim();
  }, [vars]);

  return (
    <main className="tool-container">
      <h1 className="tool-title">.env File Generator</h1>
      <p className="tool-desc">Build .env files with key-value pairs, comments, and sections. Export as .env or .env.example.</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {TEMPLATES.map((t) => (
          <button key={t.name} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px" }}
            onClick={() => setVars(t.vars)}>{t.name}</button>
        ))}
        <button className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px" }} onClick={importJson}>Import JSON</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
        {vars.map((v, i) => (
          <div key={i} style={{
            display: "flex", gap: 4, alignItems: "center",
            background: v.isSection ? "transparent" : "var(--surface)",
            border: v.isSection ? "none" : "1px solid var(--border)",
            borderRadius: 6, padding: v.isSection ? "4px 0" : "4px 8px",
          }}>
            {v.isSection ? (
              <input type="text" value={v.comment} onChange={(e) => updateVar(i, { comment: e.target.value })}
                placeholder="Section name"
                style={{ flex: 1, background: "transparent", color: "var(--muted)", border: "none", fontSize: 13, fontWeight: 600, padding: "4px 6px" }} />
            ) : (
              <>
                <input type="text" value={v.key} onChange={(e) => updateVar(i, { key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "") })}
                  placeholder="KEY"
                  style={{ width: 180, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", fontSize: 12, fontFamily: "monospace" }} />
                <span style={{ color: "var(--muted)" }}>=</span>
                <input type="text" value={v.value} onChange={(e) => updateVar(i, { value: e.target.value })}
                  placeholder="value"
                  style={{ flex: 1, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", fontSize: 12, fontFamily: "monospace" }} />
                <input type="text" value={v.comment} onChange={(e) => updateVar(i, { comment: e.target.value })}
                  placeholder="# comment"
                  style={{ width: 120, background: "var(--background)", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", fontSize: 11 }} />
              </>
            )}
            <button onClick={() => removeVar(i)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}>X</button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <button className="btn btn-secondary" onClick={addVar} style={{ fontSize: 12 }}>+ Variable</button>
        <button className="btn btn-secondary" onClick={addSection} style={{ fontSize: 12 }}>+ Section</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>.env</span>
            <button className="btn" onClick={() => copy(envOutput)} style={{ fontSize: 11, padding: "3px 8px" }}>Copy</button>
          </div>
          <pre style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
            padding: 12, fontSize: 12, fontFamily: "monospace", overflow: "auto", minHeight: 100,
            color: "var(--foreground)",
          }}>{envOutput || "# empty"}</pre>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>.env.example</span>
            <button className="btn" onClick={() => copy(envExample)} style={{ fontSize: 11, padding: "3px 8px" }}>Copy</button>
          </div>
          <pre style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8,
            padding: 12, fontSize: 12, fontFamily: "monospace", overflow: "auto", minHeight: 100,
            color: "var(--foreground)",
          }}>{envExample || "# empty"}</pre>
        </div>
      </div>

      <Toast />
    </main>
  );
}
