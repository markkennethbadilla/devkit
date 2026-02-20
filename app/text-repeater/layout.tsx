import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Text Repeater — Repeat Text Multiple Times Online | DevKit",
  description:
    "Repeat and multiply text N times with custom separators and formatting options. Perfect for testing, placeholder content, and data generation.",
  keywords: [
    "text repeater",
    "repeat text online",
    "text multiplier",
    "repeat string",
    "duplicate text",
    "text generator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Text Repeater"
        description="Repeat text multiple times with custom separators. Free, runs locally in your browser."
        url="https://tools.elunari.uk/text-repeater"
      />
      {children}
    </>
  );
}
