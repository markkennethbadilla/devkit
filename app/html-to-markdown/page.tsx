"use client";
import { useState } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function htmlToMarkdown(html: string): string {
  let md = html;

  // Block elements (order matters)
  // Headings
  md = md.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, content) => {
    return "\n" + "#".repeat(parseInt(level)) + " " + content.trim() + "\n";
  });

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    return content
      .trim()
      .split("\n")
      .map((line: string) => "> " + line.trim())
      .join("\n") + "\n";
  });

  // Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, code) => {
    return "\n```\n" + decodeHtmlEntities(code.trim()) + "\n```\n";
  });
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => {
    return "\n```\n" + decodeHtmlEntities(code.trim()) + "\n```\n";
  });

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => {
      return "- " + li.trim() + "\n";
    });
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    let i = 0;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => {
      i++;
      return i + ". " + li.trim() + "\n";
    });
  });

  // Paragraphs and divs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => {
    return "\n" + content.trim() + "\n";
  });
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, (_, content) => {
    return "\n" + content.trim() + "\n";
  });
  md = md.replace(/<br\s*\/?>/gi, "  \n");

  // Inline elements
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");
  md = md.replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, "~~$1~~");
  md = md.replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, "~~$1~~");
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, code) => {
    return "`" + code + "`";
  });

  // Links and images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

  // Table conversion
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_, table) => {
    const rows: string[][] = [];
    const rowMatches = table.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    for (const row of rowMatches) {
      const cells = (row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || []).map(
        (cell: string) => cell.replace(/<\/?t[hd][^>]*>/gi, "").trim()
      );
      rows.push(cells);
    }
    if (rows.length === 0) return "";
    const colCount = Math.max(...rows.map((r) => r.length));
    const lines = rows.map((row) => {
      const padded = Array.from({ length: colCount }, (_, i) => row[i] || "");
      return "| " + padded.join(" | ") + " |";
    });
    if (lines.length > 0) {
      const separator = "| " + Array(colCount).fill("---").join(" | ") + " |";
      lines.splice(1, 0, separator);
    }
    return "\n" + lines.join("\n") + "\n";
  });

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode remaining entities
  md = decodeHtmlEntities(md);

  // Normalize whitespace
  md = md.replace(/\n{3,}/g, "\n\n");
  return md.trim();
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function markdownToHtml(md: string): string {
  let html = md;

  // Code blocks first (preserve content)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langAttr = lang ? ` class="language-${lang}"` : "";
    return `<pre><code${langAttr}>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Headings
  html = html.replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr>");

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images & links
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Unordered lists
  html = html.replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, "<ul>$&</ul>");

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>");

  // Paragraphs (lines not already wrapped in block elements)
  const lines = html.split("\n");
  html = lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|ol|li|pre|blockquote|hr|table|tr|td|th|div)/.test(trimmed))
        return trimmed;
      if (/^<\/(ul|ol|pre|blockquote|table)>/.test(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  // Clean up empty paragraphs and double-wrapped
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>(<h[1-6]>)/g, "$1");
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");

  return html.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function HtmlToMarkdown() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"html-to-md" | "md-to-html">("html-to-md");
  const { copy, Toast } = useCopyToast();

  const convert = () => {
    if (mode === "html-to-md") {
      setOutput(htmlToMarkdown(input));
    } else {
      setOutput(markdownToHtml(input));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">HTML to Markdown Converter</h1>
      <p className="text-[var(--muted)] mb-6">
        Convert between HTML and Markdown. Handles headings, links, images,
        lists, code blocks, tables, and inline formatting.
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={() => { setMode("html-to-md"); setOutput(""); }}
          className={mode === "html-to-md" ? "btn" : "btn-secondary"}
        >
          HTML → Markdown
        </button>
        <button
          onClick={() => { setMode("md-to-html"); setOutput(""); }}
          className={mode === "md-to-html" ? "btn" : "btn-secondary"}
        >
          Markdown → HTML
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
          mode === "html-to-md"
            ? '<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> paragraph with a <a href="https://example.com">link</a>.</p>'
            : "# Hello World\n\nThis is a **bold** paragraph with a [link](https://example.com)."
        }
        rows={10}
        spellCheck={false}
        className="font-mono text-sm"
      />

      <button onClick={convert} className="btn mt-3 mb-4">
        Convert
      </button>

      {output && (
        <div className="relative">
          <button
            onClick={() => copy(output)}
            className="btn-secondary absolute top-2 right-2 text-xs"
          >
            Copy
          </button>
          <pre className="p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}

      <Toast />
    </div>
  );
}
