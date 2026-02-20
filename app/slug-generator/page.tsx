"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function slugify(text: string, separator: string, lowercase: boolean, maxLength: number): string {
  let slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/[\s_]+/g, separator) // spaces/underscores to separator
    .replace(new RegExp(`[${separator}]+`, "g"), separator) // collapse separators
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), ""); // trim separators

  if (lowercase) slug = slug.toLowerCase();
  if (maxLength > 0 && slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(new RegExp(`${separator}$`), "");
  }
  return slug;
}

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(0);
  const { copy, Toast } = useCopyToast();

  const slug = useMemo(
    () => (input ? slugify(input, separator, lowercase, maxLength) : ""),
    [input, separator, lowercase, maxLength]
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">URL Slug Generator</h1>
      <p className="text-[var(--muted)] mb-6">
        Generate clean, SEO-friendly URL slugs from any text. Strips accents,
        removes special characters, and normalizes whitespace.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="My Awesome Blog Post Title! (2026 Edition)"
        rows={3}
        spellCheck={false}
      />

      <div className="flex flex-wrap gap-4 mt-3 mb-4 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Separator:</span>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="text-sm px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)]"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
          </select>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          <span className="text-sm">Lowercase</span>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Max length:</span>
          <input
            type="number"
            value={maxLength || ""}
            onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
            placeholder="0 = unlimited"
            min={0}
            className="w-28 text-sm px-2 py-1 rounded border border-[var(--border)] bg-[var(--surface)]"
          />
        </label>
      </div>

      {slug && (
        <div className="space-y-3">
          <div
            onClick={() => copy(slug)}
            className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <div className="text-xs text-[var(--muted)] mb-1">
              Slug ({slug.length} chars) — click to copy
            </div>
            <div className="font-mono text-lg break-all">{slug}</div>
          </div>

          <div
            onClick={() => copy(`/${slug}`)}
            className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <div className="text-xs text-[var(--muted)] mb-1">Path</div>
            <div className="font-mono text-sm">/{slug}</div>
          </div>

          <div
            onClick={() => copy(`https://example.com/${slug}`)}
            className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <div className="text-xs text-[var(--muted)] mb-1">Example URL</div>
            <div className="font-mono text-sm">
              https://example.com/{slug}
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}
