"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

interface CronField {
  name: string;
  min: number;
  max: number;
  names?: string[];
}

const FIELDS: CronField[] = [
  { name: "Minute", min: 0, max: 59 },
  { name: "Hour", min: 0, max: 23 },
  { name: "Day of Month", min: 1, max: 31 },
  {
    name: "Month",
    min: 1,
    max: 12,
    names: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  {
    name: "Day of Week",
    min: 0,
    max: 6,
    names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
];

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every weekday at 9 AM", value: "0 9 * * 1-5" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Every 30 minutes", value: "*/30 * * * *" },
  { label: "First of every month", value: "0 0 1 * *" },
  { label: "Every Sunday at noon", value: "0 12 * * 0" },
];

function expandField(field: string, min: number, max: number): number[] {
  const results = new Set<number>();

  for (const part of field.split(",")) {
    const stepMatch = part.match(/^(.+)\/(\d+)$/);
    let range: string;
    let step = 1;

    if (stepMatch) {
      range = stepMatch[1];
      step = parseInt(stepMatch[2]);
    } else {
      range = part;
    }

    if (range === "*") {
      for (let i = min; i <= max; i += step) results.add(i);
    } else if (range.includes("-")) {
      const [start, end] = range.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i += step) results.add(i);
      }
    } else {
      const num = parseInt(range);
      if (!isNaN(num) && num >= min && num <= max) {
        if (stepMatch) {
          for (let i = num; i <= max; i += step) results.add(i);
        } else {
          results.add(num);
        }
      }
    }
  }

  return Array.from(results).sort((a, b) => a - b);
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (expected 5 fields)";

  const [minute, hour, dom, month, dow] = parts;
  const pieces: string[] = [];

  // Minute
  if (minute === "*") pieces.push("Every minute");
  else if (minute.startsWith("*/"))
    pieces.push(`Every ${minute.slice(2)} minutes`);
  else pieces.push(`At minute ${minute}`);

  // Hour
  if (hour !== "*") {
    if (hour.startsWith("*/")) pieces.push(`every ${hour.slice(2)} hours`);
    else pieces.push(`past hour ${hour}`);
  }

  // Day of month
  if (dom !== "*") {
    pieces.push(`on day ${dom} of the month`);
  }

  // Month
  if (month !== "*") {
    const monthNames = FIELDS[3].names!;
    const expanded = expandField(month, 1, 12);
    pieces.push(
      `in ${expanded.map((m) => monthNames[m] || m).join(", ")}`
    );
  }

  // Day of week
  if (dow !== "*") {
    const dayNames = FIELDS[4].names!;
    const expanded = expandField(dow, 0, 6);
    pieces.push(
      `on ${expanded.map((d) => dayNames[d] || d).join(", ")}`
    );
  }

  return pieces.join(", ");
}

function getNextRuns(expr: string, count: number): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minField, hourField, domField, monField, dowField] = parts;
  const minutes = expandField(minField, 0, 59);
  const hours = expandField(hourField, 0, 23);
  const doms = expandField(domField, 1, 31);
  const months = expandField(monField, 1, 12);
  const dows = expandField(dowField, 0, 6);

  if (!minutes.length || !hours.length) return [];

  const results: Date[] = [];
  const now = new Date();
  const candidate = new Date(now);
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);

  const maxIterations = 525960; // ~1 year of minutes
  for (let i = 0; i < maxIterations && results.length < count; i++) {
    const m = candidate.getMinutes();
    const h = candidate.getHours();
    const d = candidate.getDate();
    const mo = candidate.getMonth() + 1;
    const dw = candidate.getDay();

    if (
      minutes.includes(m) &&
      hours.includes(h) &&
      doms.includes(d) &&
      months.includes(mo) &&
      dows.includes(dw)
    ) {
      results.push(new Date(candidate));
    }

    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  return results;
}

export default function CronParser() {
  const [expression, setExpression] = useState("*/5 * * * *");
  const { copy, Toast } = useCopyToast();

  const description = useMemo(() => describeCron(expression), [expression]);
  const nextRuns = useMemo(() => getNextRuns(expression, 10), [expression]);
  const parts = expression.trim().split(/\s+/);
  const isValid = parts.length === 5;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Cron Expression Parser</h1>
      <p className="text-[var(--muted)] mb-6">
        Parse and explain cron expressions with next scheduled run times.
        Standard 5-field format (minute, hour, day, month, weekday).
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="*/5 * * * *"
          className="font-mono text-lg flex-1"
          spellCheck={false}
        />
        <button onClick={() => copy(expression)} className="btn-secondary">
          Copy
        </button>
      </div>

      {isValid && (
        <div className="grid grid-cols-5 gap-2 mb-4">
          {parts.map((part, i) => (
            <div
              key={i}
              className="text-center p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="font-mono text-sm mb-1">{part}</div>
              <div className="text-[10px] text-[var(--muted)]">
                {FIELDS[i].name}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] mb-4">
        <div className="text-xs text-[var(--muted)] mb-1">Description</div>
        <div className="text-sm">{description}</div>
      </div>

      {nextRuns.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-2 text-[var(--muted)]">
            Next {nextRuns.length} Run Times
          </h2>
          <div className="space-y-1">
            {nextRuns.map((date, i) => (
              <div
                key={i}
                className="text-sm font-mono p-2 rounded border border-[var(--border)] bg-[var(--surface)]"
              >
                {date.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold mb-2 text-[var(--muted)]">
          Common Presets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setExpression(p.value)}
              className="text-left p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              <div className="font-mono text-xs text-[var(--accent)]">
                {p.value}
              </div>
              <div className="text-xs text-[var(--muted)]">{p.label}</div>
            </button>
          ))}
        </div>
      </div>

      <Toast />
    </div>
  );
}
