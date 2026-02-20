import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Markdown Preview — Live Markdown Editor Online - DevKit",
  description:
    "Write Markdown and preview rendered HTML in real time. Free online Markdown editor with live preview.",
  keywords: ["markdown preview", "markdown editor", "markdown to html", "live markdown preview", "markdown renderer", "online markdown editor"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Markdown Preview"
        description="Write Markdown and preview rendered HTML in real time. Free online Markdown editor with live preview."
        url="/markdown-preview"
      />
      {children}
    </>
  );
}
