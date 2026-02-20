import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "JSON to YAML Converter — Convert JSON to YAML Online | DevKit",
  description:
    "Convert JSON to YAML and YAML to JSON instantly. Handles nested objects, arrays, and special characters. Free, runs locally in your browser.",
  keywords: [
    "json to yaml",
    "json to yaml converter",
    "convert json to yaml online",
    "yaml generator",
    "json yaml",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="JSON to YAML Converter"
        description="Convert JSON to YAML and back. Free, runs locally in your browser."
        url="https://tools.elunari.uk/json-to-yaml"
      />
      {children}
    </>
  );
}
