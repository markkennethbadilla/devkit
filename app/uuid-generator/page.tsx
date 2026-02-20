"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const { copy, Toast } = useCopyToast();

  const generate = () => {
    const list = Array.from({ length: count }, () => {
      let id = uuidv4();
      if (noDashes) id = id.replace(/-/g, "");
      if (uppercase) id = id.toUpperCase();
      return id;
    });
    setUuids(list);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">UUID Generator</h1>
      <p className="text-[var(--muted)] mb-6">
        Generate random v4 UUIDs. Customize format and generate in bulk.
      </p>
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <label className="text-sm">Count:</label>
        <input type="number" value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))} className="!w-20" min={1} max={100} />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
          Uppercase
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} />
          No dashes
        </label>
        <button onClick={generate} className="btn">Generate</button>
      </div>
      {uuids.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--muted)]">{uuids.length} UUIDs generated</span>
            <button onClick={() => copy(uuids.join("\n"))} className="text-xs text-[var(--accent)] hover:underline">Copy All</button>
          </div>
          <textarea value={uuids.join("\n")} readOnly rows={Math.min(uuids.length + 1, 20)} spellCheck={false} />
        </div>
      )}
      <section className="mt-12 text-sm text-[var(--muted)] space-y-3">
        <h2 className="text-lg font-semibold text-[var(--fg)]">About UUIDs</h2>
        <p>A UUID (Universally Unique Identifier) is a 128-bit identifier used to uniquely identify resources. Version 4 UUIDs are randomly generated and have a very low probability of collision, making them ideal for database primary keys, session tokens, and distributed systems.</p>
      </section>
      <Toast />
    </div>
  );
}
