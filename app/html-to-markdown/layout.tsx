import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "HTML to Markdown Converter — Convert HTML Online | DevKit",
  description:
    "Convert HTML to Markdown and Markdown to HTML online. Handles headings, links, images, lists, code blocks, bold, italic, and more.",
  keywords: [
    "html to markdown",
    "markdown to html",
    "html to md",
    "convert html to markdown",
    "html markdown converter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="HTML to Markdown Converter"
        description="Convert between HTML and Markdown formats online."
        url="https://tools.elunari.uk/html-to-markdown"
      />
      {children}
    </>
  );
}
