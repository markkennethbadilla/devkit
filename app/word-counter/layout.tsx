import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Word Counter & Text Analyzer - DevKit",
  description:
    "Count words, characters, sentences, and paragraphs. Estimate reading time and analyze text statistics in real time.",
  keywords: ["word counter", "character counter", "text analyzer", "word count online", "sentence counter", "reading time calculator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Word Counter & Text Analyzer"
        description="Count words, characters, sentences, and paragraphs. Estimate reading time and analyze text statistics in real time."
        url="/word-counter"
      />
      {children}
    </>
  );
}
