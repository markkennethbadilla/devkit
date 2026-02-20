"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface Field {
  name: string;
  min: number;
  max: number;
  labels?: string[];
}

const FIELDS: Field[] = [
  { name: "Minute", min: 0, max: 59 },
  { name: "Hour", min: 0, max: 23 },
  { name: "Day of Month", min: 1, max: 31 },
  { name: "Month", min: 1, max: 12, labels: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
  { name: "Day of Week", min: 0, max: 6, labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] },
];

type FieldMode = "every" | "specific" | "range" | "step";

interface FieldState {
  mode: FieldMode;
  specific: number[];
  rangeStart: number;
  rangeEnd: number;
  step: number;
}

const PRESETS: { label: string; cron: string }[] = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every Monday at 9 AM", cron: "0 9 * * 1" },
  { label: "Every weekday at 8 AM", cron: "0 8 * * 1-5" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
  { label: "Every day at noon", cron: "0 12 * * *" },
  { label: "1st of every month", cron: "0 0 1 * *" },
  { label: "Every Sunday at 3 AM", cron: "0 3 * * 0" },
];

function defaultFieldState(field: Field): FieldState {
  return { mode: "every", specific: [], rangeStart: field.min, rangeEnd: field.max, step: 1 };
}

function fieldToExpr(fs: FieldState, field: Field): string {
  switch (fs.mode) {
    case "every": return "*";
    case "specific": return fs.specific.length ? fs.specific.sort((a, b) => a - b).join(",") : "*";
    case "range": return `${fs.rangeStart}-${fs.rangeEnd}`;
    case "step": return `*/${fs.step}`;
    default: return "*";
  }
}

function describeExpression(cron: string): string {
  const parts = cron.split(" ");
  if (parts.length !== 5) return "";
  const [min, hour, dom, mon, dow] = parts;
  const pieces: string[] = [];

  if (min === "*" && hour === "*") pieces.push("Every minute");
  else if (min === "*") pieces.push("Every minute");
  else if (min.startsWith("*/")) pieces.push(`Every ${min.slice(2)} minutes`);
  else pieces.push(`At minute ${min}`);

  if (hour !== "*") {
    if (hour.startsWith("*/")) pieces.push(`every ${hour.slice(2)} hours`);
    else if (hour.includes("-")) pieces.push(`during hours ${hour}`);
    else if (hour.includes(",")) pieces.push(`at hours ${hour}`);
    else pieces.push(`past hour ${hour}`);
  }

  if (dom !== "*") {
    if (dom.startsWith("*/")) pieces.push(`every ${dom.slice(2)} days`);
    else pieces.push(`on day ${dom}`);
  }

  if (mon !== "*") {
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = parseInt(mon);
    if (m >= 1 && m <= 12) pieces.push(`in ${monthNames[m]}`);
    else pieces.push(`in month ${mon}`);
  }

  if (dow !== "*") {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (dow.includes("-")) {
      const [s, e] = dow.split("-").map(Number);
      pieces.push(`on ${dayNames[s]}-${dayNames[e]}`);
    } else {
      const d = parseInt(dow);
      if (d >= 0 && d <= 6) pieces.push(`on ${dayNames[d]}`);
      else pieces.push(`on day-of-week ${dow}`);
    }
  }

  return pieces.join(", ");
}

export default function CrontabGeneratorPage() {
  const { copy, Toast } = useCopyToast();
  const [fields, setFields] = useState<FieldState[]>(FIELDS.map(defaultFieldState));

  const updateField = (idx: number, updates: Partial<FieldState>) => {
    setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, ...updates } : f)));
  };

  const toggleSpecific = (idx: number, val: number) => {
    setFields((prev) => prev.map((f, i) => {
      if (i !== idx) return f;
      const specific = f.specific.includes(val) ? f.specific.filter((v) => v !== val) : [...f.specific, val];
      return { ...f, specific };
    }));
  };

  const cronExpr = useMemo(() => {
    return fields.map((fs, i) => fieldToExpr(fs, FIELDS[i])).join(" ");
  }, [fields]);

  const description = useMemo(() => describeExpression(cronExpr), [cronExpr]);

  const applyPreset = (cron: string) => {
    const parts = cron.split(" ");
    setFields(FIELDS.map((field, i) => {
      const part = parts[i];
      if (part === "*") return defaultFieldState(field);
      if (part.startsWith("*/")) return { mode: "step" as const, specific: [], rangeStart: field.min, rangeEnd: field.max, step: parseInt(part.slice(2)) };
      if (part.includes("-")) {
        const [s, e] = part.split("-").map(Number);
        return { mode: "range" as const, specific: [], rangeStart: s, rangeEnd: e, step: 1 };
      }
      if (part.includes(",")) return { mode: "specific" as const, specific: part.split(",").map(Number), rangeStart: field.min, rangeEnd: field.max, step: 1 };
      return { mode: "specific" as const, specific: [parseInt(part)], rangeStart: field.min, rangeEnd: field.max, step: 1 };
    }));
  };

  return (
    <main className="tool-container">
      <h1 className="tool-title">Crontab Generator</h1>
      <p className="tool-desc">Build cron schedule expressions visually. Configure each field and copy the result.</p>

      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
        padding: 20, textAlign: "center", marginBottom: 20,
      }}>
        <code style={{ fontSize: 28, fontFamily: "monospace", letterSpacing: 2, color: "var(--accent)" }}>{cronExpr}</code>
        <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>{description}</div>
        <button className="btn" onClick={() => copy(cronExpr)} style={{ marginTop: 12 }}>Copy Expression</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Presets</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PRESETS.map((p) => (
            <button key={p.cron} className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 8px" }}
              onClick={() => applyPreset(p.cron)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FIELDS.map((field, i) => {
          const fs = fields[i];
          return (
            <div key={field.name} style={{
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14,
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{field.name}</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {(["every", "specific", "range", "step"] as FieldMode[]).map((mode) => (
                  <button key={mode} className={fs.mode === mode ? "btn" : "btn btn-secondary"}
                    style={{ fontSize: 11, padding: "3px 8px", textTransform: "capitalize" }}
                    onClick={() => updateField(i, { mode })}>
                    {mode}
                  </button>
                ))}
              </div>

              {fs.mode === "specific" && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {Array.from({ length: field.max - field.min + 1 }, (_, j) => field.min + j).map((val) => (
                    <button key={val}
                      onClick={() => toggleSpecific(i, val)}
                      style={{
                        width: 36, height: 28, fontSize: 11, borderRadius: 4,
                        border: "1px solid var(--border)", cursor: "pointer",
                        background: fs.specific.includes(val) ? "var(--accent)" : "var(--background)",
                        color: fs.specific.includes(val) ? "#fff" : "var(--foreground)",
                      }}>
                      {field.labels ? field.labels[val] || val : val}
                    </button>
                  ))}
                </div>
              )}

              {fs.mode === "range" && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input type="number" min={field.min} max={field.max} value={fs.rangeStart}
                    onChange={(e) => updateField(i, { rangeStart: +e.target.value })}
                    style={{ width: 60, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", fontSize: 13 }} />
                  <span style={{ color: "var(--muted)" }}>to</span>
                  <input type="number" min={field.min} max={field.max} value={fs.rangeEnd}
                    onChange={(e) => updateField(i, { rangeEnd: +e.target.value })}
                    style={{ width: 60, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", fontSize: 13 }} />
                </div>
              )}

              {fs.mode === "step" && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>Every</span>
                  <input type="number" min={1} max={field.max} value={fs.step}
                    onChange={(e) => updateField(i, { step: Math.max(1, +e.target.value) })}
                    style={{ width: 60, background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 6px", fontSize: 13 }} />
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{field.name.toLowerCase()}{fs.step > 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Toast />
    </main>
  );
}
