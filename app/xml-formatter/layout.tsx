import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "XML Formatter & Minifier — Format, Beautify, Minify XML Online | DevKit",
  description:
    "Format, beautify, and minify XML documents online. Indent with custom spacing, collapse tags, and validate structure. Free, runs locally in your browser.",
  keywords: [
    "xml formatter",
    "xml beautifier",
    "xml minifier",
    "format xml online",
    "xml pretty print",
    "xml validator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="XML Formatter & Minifier"
        description="Format, beautify, and minify XML documents online. Free, runs locally in your browser."
        url="https://tools.elunari.uk/xml-formatter"
      />
      {children}
    </>
  );
}
