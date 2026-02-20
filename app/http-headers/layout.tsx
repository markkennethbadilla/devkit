import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTTP Headers Reference – DevKit",
  description: "Complete HTTP request and response headers reference with descriptions, examples, and categories. Search and filter headers instantly.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
