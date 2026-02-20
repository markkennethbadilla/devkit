import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "TOML to JSON Converter — Convert TOML to JSON Online | DevKit",
  description:
    "Convert between TOML and JSON configuration formats instantly. Lightweight client-side converter with syntax validation.",
  keywords: [
    "toml to json",
    "json to toml",
    "toml converter",
    "toml parser",
    "convert toml to json",
    "toml to json online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="TOML to JSON Converter"
        description="Convert between TOML and JSON configuration formats."
        url="https://tools.elunari.uk/toml-to-json"
      />
      {children}
    </>
  );
}
