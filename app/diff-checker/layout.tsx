import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Diff Checker — Compare Two Texts Side by Side Online",
  description:
    "Free online diff checker. Compare two texts and see line-by-line differences with color-coded highlighting. Uses LCS algorithm for accurate results.",
  keywords: ["diff checker", "text compare", "diff tool", "compare text online", "text diff", "code diff"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Diff Checker"
        description="Free online diff checker. Compare two texts and see line-by-line differences with color-coded highlighting. Uses LCS algorithm for accurate results."
        url="/diff-checker"
      />
      {children}
    </>
  );
}
