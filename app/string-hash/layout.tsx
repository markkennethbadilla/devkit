import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "String Hash Generator — Hash Text with Multiple Algorithms | DevKit",
  description:
    "Hash any string with MD5, SHA-1, SHA-256, SHA-384, SHA-512 simultaneously. Compare hashes side-by-side. Free, runs locally in your browser.",
  keywords: [
    "string hash",
    "hash generator",
    "sha256 hash",
    "md5 hash",
    "sha512 hash",
    "hash text online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="String Hash Generator"
        description="Hash strings with SHA-256, SHA-384, SHA-512, SHA-1 simultaneously. Free, runs locally in your browser."
        url="https://tools.elunari.uk/string-hash"
      />
      {children}
    </>
  );
}
