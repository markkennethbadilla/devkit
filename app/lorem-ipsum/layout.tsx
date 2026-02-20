import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Generate Placeholder Text Online",
  description: "Free Lorem Ipsum generator. Generate paragraphs, sentences, or words of placeholder text for designs and mockups. Copy with one click.",
  keywords: ["lorem ipsum generator", "placeholder text", "dummy text", "lipsum", "generate lorem ipsum"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
