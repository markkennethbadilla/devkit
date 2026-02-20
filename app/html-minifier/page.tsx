"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function minifyHtml(html: string, options: {
  removeComments: boolean;
  removeWhitespace: boolean;
  removeOptionalTags: boolean;
  removeAttributes: boolean;
}): string {
  let result = html;

  if (options.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, "");
  }

  if (options.removeWhitespace) {
    // Collapse whitespace between tags
    result = result.replace(/>\s+</g, "><");
    // Collapse multiple spaces/newlines to single space
    result = result.replace(/\s{2,}/g, " ");
    // Trim leading/trailing whitespace
    result = result.trim();
  }

  if (options.removeOptionalTags) {
    // Remove optional closing tags
    result = result.replace(/<\/(li|dt|dd|p|tr|td|th|thead|tbody|tfoot|option|colgroup)>/gi, "");
  }

  if (options.removeAttributes) {
    // Remove type="text/javascript" and type="text/css"
    result = result.replace(/\s*type\s*=\s*["']text\/(javascript|css)["']/gi, "");
    // Remove boolean attribute values
    result = result.replace(/\s*(checked|disabled|readonly|selected|autofocus|autoplay|controls|loop|muted|required|multiple|hidden)\s*=\s*["'](true|checked|disabled|readonly|selected|autofocus|autoplay|controls|loop|muted|required|multiple|hidden|)["']/gi, " $1");
  }

  return result;
}

const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <link rel="stylesheet" type="text/css" href="styles.css">
  <script type="text/javascript" src="app.js"></script>
</head>
<body>
  <!-- Main content -->
  <div class="container">
    <h1>Hello World</h1>
    <p>This is a sample paragraph.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <input type="text" required="required" disabled="disabled">
  </div>
</body>
</html>`;

export default function HtmlMinifierPage() {
  const [input, setInput] = useState(sampleHtml);
  const [removeComments, setRemoveComments] = useState(true);
  const [removeWhitespace, setRemoveWhitespace] = useState(true);
  const [removeOptionalTags, setRemoveOptionalTags] = useState(false);
  const [removeAttributes, setRemoveAttributes] = useState(true);
  const { copy, Toast } = useCopyToast();

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return minifyHtml(input, {
      removeComments,
      removeWhitespace,
      removeOptionalTags,
      removeAttributes,
    });
  }, [input, removeComments, removeWhitespace, removeOptionalTags, removeAttributes]);

  const savings = useMemo(() => {
    if (!input.trim() || !output) return null;
    const original = new Blob([input]).size;
    const minified = new Blob([output]).size;
    const saved = original - minified;
    const percent = ((saved / original) * 100).toFixed(1);
    return { original, minified, saved, percent };
  }, [input, output]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">HTML Minifier</h1>
      <p className="text-[var(--muted)] mb-6">
        Minify HTML by removing whitespace, comments, and optional tags. Reduce file size instantly.
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={removeComments} onChange={(e) => setRemoveComments(e.target.checked)} />
          Remove comments
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={removeWhitespace} onChange={(e) => setRemoveWhitespace(e.target.checked)} />
          Collapse whitespace
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={removeOptionalTags} onChange={(e) => setRemoveOptionalTags(e.target.checked)} />
          Remove optional closing tags
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={removeAttributes} onChange={(e) => setRemoveAttributes(e.target.checked)} />
          Clean attributes
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Input HTML</label>
          <textarea
            className="w-full h-64 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your HTML here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Minified Output</label>
          <textarea
            className="w-full h-64 rounded bg-[var(--card)] border border-[var(--border)] p-3 font-mono text-sm"
            value={output}
            readOnly
            placeholder="Minified HTML will appear here..."
          />
        </div>
      </div>

      {savings && (
        <div className="rounded bg-[var(--card)] border border-[var(--border)] p-4 mb-4 grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="text-[var(--muted)]">Original</div>
            <div className="font-mono font-bold">{savings.original.toLocaleString()} B</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Minified</div>
            <div className="font-mono font-bold">{savings.minified.toLocaleString()} B</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Saved</div>
            <div className="font-mono font-bold text-green-500">{savings.saved.toLocaleString()} B</div>
          </div>
          <div>
            <div className="text-[var(--muted)]">Reduction</div>
            <div className="font-mono font-bold text-green-500">{savings.percent}%</div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button className="btn" onClick={() => copy(output)}>
          Copy Minified
        </button>
        <button className="btn-secondary" onClick={() => setInput("")}>
          Clear
        </button>
        <button className="btn-secondary" onClick={() => setInput(sampleHtml)}>
          Load Sample
        </button>
      </div>

      <Toast />
    </main>
  );
}
