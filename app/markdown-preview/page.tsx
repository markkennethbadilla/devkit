"use client";
import { useState } from "react";

const SAMPLE = `# Hello World

This is a **Markdown** preview tool.

## Features
- Live preview as you type
- Supports *italic*, **bold**, and \`inline code\`
- Code blocks with syntax highlighting

\`\`\`javascript
const greeting = "Hello, DevKit!";
console.log(greeting);
\`\`\`

### Tables

| Tool | Description |
|------|-------------|
| Markdown | Preview tool |
| JSON | Formatter |

> Blockquotes work too!

1. Ordered lists
2. Are supported
3. As well

---

[Links](https://tools.elunari.uk) and images work too.
`;

function parseMarkdown(md: string): string {
  let html = md;
  // Code blocks (must be first to avoid inner replacements)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  // Headings
  html = html.replace(/^######\s+(.*)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.*)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.*)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.*)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.*)$/gm, "<h1>$1</h1>");
  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Blockquotes
  html = html.replace(/^>\s+(.*)$/gm, "<blockquote>$1</blockquote>");
  // Unordered list items
  html = html.replace(/^-\s+(.*)$/gm, "<li>$1</li>");
  // Ordered list items
  html = html.replace(/^\d+\.\s+(.*)$/gm, "<li>$1</li>");
  // Simple table support
  html = html.replace(/^\|(.+)\|$/gm, (_, row: string) => {
    const cells = row.split("|").map((c: string) => c.trim()).filter(Boolean);
    if (cells.every((c: string) => /^[-:]+$/.test(c))) return "";
    const tds = cells.map((c: string) => `<td>${c}</td>`).join("");
    return `<tr>${tds}</tr>`;
  });
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");
  // Wrap <tr> in <table>
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, "<table>$1</table>");
  // Paragraphs (lines not already wrapped)
  html = html.replace(/^(?!<[a-z/])(.*\S.*)$/gm, "<p>$1</p>");
  // Clean empty lines
  html = html.replace(/\n{2,}/g, "\n");
  return html;
}

export default function MarkdownPreview() {
  const [input, setInput] = useState(SAMPLE);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Markdown Preview</h1>
      <p className="text-[var(--muted)] mb-6">
        Write Markdown on the left, see live HTML preview on the right. No dependencies, runs in your browser.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "500px" }}>
        <div className="flex flex-col">
          <label className="text-sm text-[var(--muted)] mb-1">Markdown Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your Markdown here..."
            className="flex-1"
            rows={20}
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-[var(--muted)] mb-1">Preview</label>
          <div
            className="markdown-preview flex-1 overflow-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(input) }}
          />
        </div>
      </div>

      <style>{`
        .markdown-preview h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0 0.3em; }
        .markdown-preview h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0 0.3em; }
        .markdown-preview h3 { font-size: 1.2em; font-weight: bold; margin: 0.5em 0 0.3em; }
        .markdown-preview p { margin: 0.5em 0; }
        .markdown-preview strong { font-weight: bold; }
        .markdown-preview em { font-style: italic; }
        .markdown-preview code { background: rgba(59,130,246,0.15); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
        .markdown-preview pre { background: #1e1e1e; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 0.5em 0; }
        .markdown-preview pre code { background: none; padding: 0; }
        .markdown-preview blockquote { border-left: 3px solid var(--accent); padding-left: 12px; color: var(--muted); margin: 0.5em 0; }
        .markdown-preview ul, .markdown-preview ol { padding-left: 24px; margin: 0.5em 0; }
        .markdown-preview li { margin: 4px 0; list-style: disc; }
        .markdown-preview hr { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
        .markdown-preview a { color: var(--accent); text-decoration: underline; }
        .markdown-preview table { border-collapse: collapse; width: 100%; margin: 0.5em 0; }
        .markdown-preview td { border: 1px solid var(--border); padding: 8px; }
      `}</style>
    </div>
  );
}
