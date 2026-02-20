import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "HTML Minifier — Minify HTML Online | DevKit",
  description:
    "Minify HTML by removing whitespace, comments, and optional tags. Reduce file size instantly. Free, runs locally in your browser.",
  keywords: [
    "html minifier",
    "minify html online",
    "html compressor",
    "reduce html size",
    "html optimization",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="HTML Minifier"
        description="Minify HTML by removing whitespace, comments, and optional tags. Free, runs locally in your browser."
        url="https://tools.elunari.uk/html-minifier"
      />
      {children}
    </>
  );
}
