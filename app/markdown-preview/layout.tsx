import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Markdown Preview — Live Markdown to HTML Converter",
  description: "Free online Markdown preview and editor. Write Markdown and see live HTML output. Supports headings, lists, code blocks, tables, and more. No data leaves your browser.",
  keywords: ["markdown preview", "markdown to html", "markdown editor online", "markdown converter", "live markdown preview"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
