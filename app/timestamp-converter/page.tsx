"use client";
import { useState, useEffect } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [now, setNow] = useState(0);
  const [isMs, setIsMs] = useState(false);
  const { copy, Toast } = useCopyToast();

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const nowSec = Math.floor(now / 1000);

  const timestampToDate = () => {
    try {
      let ts = parseInt(timestamp, 10);
      if (isNaN(ts)) return;
      if (!isMs && ts < 1e12) ts *= 1000;
      const d = new Date(ts);
      if (isNaN(d.getTime())) return;
      setDateStr(d.toISOString());
    } catch { /* ignore */ }
  };

  const dateToTimestamp = () => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;
      setTimestamp(isMs ? String(d.getTime()) : String(Math.floor(d.getTime() / 1000)));
    } catch { /* ignore */ }
  };

  const setNowTimestamp = () => {
    const ts = isMs ? now : nowSec;
    setTimestamp(String(ts));
    const d = new Date(now);
    setDateStr(d.toISOString());
  };

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    return d.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Unix Timestamp Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert between Unix epoch timestamps and human-readable dates. Supports seconds and milliseconds.
      </p>

      <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <div className="text-sm text-[var(--muted)] mb-1">Current Time</div>
        <div className="flex gap-4 flex-wrap items-center">
          <div className="font-mono text-xl text-[var(--accent)]">
            {nowSec}
            <span className="text-sm text-[var(--muted)] ml-2">(seconds)</span>
          </div>
          <button onClick={() => copy(String(nowSec))} className="text-xs text-[var(--accent)] hover:underline">
            Copy
          </button>
        </div>
        <div className="text-sm text-[var(--muted)] mt-1">{now > 0 ? formatDate(now) : ""}</div>
      </div>

      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isMs}
            onChange={(e) => setIsMs(e.target.checked)}
            className="!w-auto"
          />
          Use milliseconds
        </label>
        <button onClick={setNowTimestamp} className="btn btn-secondary text-sm">
          Use Current Time
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            Timestamp ({isMs ? "milliseconds" : "seconds"})
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder={isMs ? "1708905600000" : "1708905600"}
            />
            <button onClick={timestampToDate} className="btn whitespace-nowrap">
              To Date →
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--muted)] mb-1 block">
            Date (ISO 8601)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              placeholder="2026-02-26T00:00:00.000Z"
            />
            <button onClick={dateToTimestamp} className="btn whitespace-nowrap">
              ← To Timestamp
            </button>
          </div>
        </div>
      </div>

      {dateStr && (
        <div className="mt-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-sm text-[var(--muted)] mb-2">Parsed Date</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono">
            <div>
              <span className="text-[var(--muted)]">ISO: </span>
              {(() => { try { return new Date(dateStr).toISOString(); } catch { return "Invalid"; } })()}
            </div>
            <div>
              <span className="text-[var(--muted)]">Local: </span>
              {(() => { try { return new Date(dateStr).toLocaleString(); } catch { return "Invalid"; } })()}
            </div>
            <div>
              <span className="text-[var(--muted)]">UTC: </span>
              {(() => { try { return new Date(dateStr).toUTCString(); } catch { return "Invalid"; } })()}
            </div>
            <div>
              <span className="text-[var(--muted)]">Seconds: </span>
              {(() => { try { return Math.floor(new Date(dateStr).getTime() / 1000); } catch { return "Invalid"; } })()}
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}
