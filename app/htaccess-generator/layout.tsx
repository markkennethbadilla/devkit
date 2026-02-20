import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: ".htaccess Generator — Create Apache Redirect Rules Online | DevKit",
  description:
    "Generate .htaccess rules for redirects, rewrites, security headers, caching, and gzip compression. Build Apache configuration visually.",
  keywords: [
    "htaccess generator",
    "htaccess redirect",
    "apache rewrite rules",
    "htaccess builder",
    "301 redirect generator",
    "htaccess security headers",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name=".htaccess Generator"
        description="Generate .htaccess rules for redirects, security headers, and caching. Free, runs locally."
        url="https://tools.elunari.uk/htaccess-generator"
      />
      {children}
    </>
  );
}
