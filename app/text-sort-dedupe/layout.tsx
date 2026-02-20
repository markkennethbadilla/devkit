import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Text Sort & Deduplicate — Sort Lines, Remove Duplicates | DevKit",
  description:
    "Sort lines alphabetically, numerically, or by length. Remove duplicates, trim whitespace, filter empty lines, and reverse order.",
  keywords: [
    "sort lines online",
    "remove duplicate lines",
    "text sort tool",
    "deduplicate text",
    "sort text alphabetically",
    "line sorter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Text Sort & Deduplicate"
        description="Sort lines, remove duplicates, trim whitespace, and filter empty lines online."
        url="https://tools.elunari.uk/text-sort-dedupe"
      />
      {children}
    </>
  );
}
