import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "XML to JSON Converter — Convert XML to JSON Online | DevKit",
  description:
    "Convert XML to JSON and JSON to XML instantly. Handles attributes, nested elements, and arrays. Free, runs locally in your browser.",
  keywords: [
    "xml to json",
    "xml to json converter",
    "convert xml to json online",
    "json to xml",
    "xml json",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="XML to JSON Converter"
        description="Convert XML to JSON and JSON to XML. Free, runs locally in your browser."
        url="https://tools.elunari.uk/xml-to-json"
      />
      {children}
    </>
  );
}
