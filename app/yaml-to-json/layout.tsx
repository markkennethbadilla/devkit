import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "YAML to JSON Converter — Convert YAML & JSON Online | DevKit",
  description:
    "Convert between YAML and JSON formats instantly. Validate YAML syntax, convert to JSON, and vice versa with proper formatting.",
  keywords: [
    "yaml to json",
    "json to yaml",
    "yaml converter",
    "yaml parser",
    "yaml validator",
    "convert yaml to json online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="YAML to JSON Converter"
        description="Convert between YAML and JSON formats instantly online."
        url="https://tools.elunari.uk/yaml-to-json"
      />
      {children}
    </>
  );
}
