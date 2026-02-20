import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Text Case Converter — Change Text Case Online",
  description:
    "Free online text case converter. Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more.",
  keywords: [
    "text case converter",
    "uppercase converter",
    "lowercase converter",
    "title case",
    "camelcase converter",
    "snake case converter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Text Case Converter"
        description="Free online text case converter. Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and more."
        url="/text-case-converter"
      />
      {children}
    </>
  );
}
