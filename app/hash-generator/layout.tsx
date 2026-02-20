import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hash Generator — SHA-256, SHA-512, SHA-1 Online",
  description: "Free online hash generator. Compute SHA-256, SHA-384, SHA-512, and SHA-1 hashes from any text. Uses Web Crypto API — data never leaves your browser.",
  keywords: ["hash generator", "sha256 generator", "sha512 online", "sha1 hash", "hash calculator", "crypto hash"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
