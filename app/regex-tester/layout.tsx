import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Regex Tester — Test Regular Expressions Online",
  description:
    "Free online regex tester. Test patterns with live highlighting, capture groups, and flags. JavaScript regex engine, runs in your browser.",
  keywords: ["regex tester", "regex101", "regular expression tester", "regex online", "test regex", "regex debugger"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Regex Tester"
        description="Free online regex tester. Test patterns with live highlighting, capture groups, and flags. JavaScript regex engine, runs in your browser."
        url="/regex-tester"
      />
      {children}
    </>
  );
}
