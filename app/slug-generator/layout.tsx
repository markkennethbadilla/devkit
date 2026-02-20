import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "URL Slug Generator — Create SEO-Friendly Slugs | DevKit",
  description:
    "Generate clean, SEO-friendly URL slugs from any text. Handles Unicode, removes special characters, converts to lowercase with hyphens.",
  keywords: [
    "url slug generator",
    "slug generator",
    "seo slug",
    "url friendly string",
    "slugify text",
    "create url slug",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="URL Slug Generator"
        description="Generate clean, SEO-friendly URL slugs from any text online."
        url="https://tools.elunari.uk/slug-generator"
      />
      {children}
    </>
  );
}
