import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "TypeScript to JSON — Generate Sample JSON from TypeScript | DevKit",
  description:
    "Generate sample JSON data from TypeScript interfaces and types. Parses interface definitions and creates matching JSON objects with realistic sample values.",
  keywords: [
    "typescript to json",
    "ts to json",
    "interface to json",
    "typescript interface to json",
    "generate json from typescript",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="TypeScript to JSON"
        description="Generate sample JSON from TypeScript interfaces and types. Free, runs locally in your browser."
        url="https://tools.elunari.uk/typescript-to-json"
      />
      {children}
    </>
  );
}
