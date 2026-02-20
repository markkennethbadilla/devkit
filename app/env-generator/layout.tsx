import type { Metadata } from "next";
export const metadata: Metadata = {
  title: ".env File Generator – DevKit",
  description: "Generate .env files with key-value pairs, comments, and sections. Supports import from JSON and export templates.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
