import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "String Escape/Unescape — Escape Strings for JSON, HTML, URLs | DevKit",
  description:
    "Escape and unescape strings for JSON, HTML, URL, XML, CSV, regex, and more. Convert special characters to their escaped equivalents.",
  keywords: [
    "string escape",
    "string unescape",
    "escape json string",
    "escape html",
    "escape regex",
    "unescape string online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="String Escape/Unescape"
        description="Escape and unescape strings for JSON, HTML, URLs, XML, regex, and more."
        url="https://tools.elunari.uk/string-escape"
      />
      {children}
    </>
  );
}
