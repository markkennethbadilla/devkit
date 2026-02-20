import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "JSON to TypeScript — Generate Interfaces from JSON | DevKit",
  description:
    "Convert JSON objects to TypeScript interfaces and types automatically. Handles nested objects, arrays, optional fields, and union types. Free, runs locally.",
  keywords: [
    "json to typescript",
    "generate typescript interfaces",
    "json to ts",
    "typescript type generator",
    "json to interface",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="JSON to TypeScript"
        description="Convert JSON objects to TypeScript interfaces automatically. Free, runs locally in your browser."
        url="https://tools.elunari.uk/json-to-typescript"
      />
      {children}
    </>
  );
}
