import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Entity Encoder / Decoder - DevKit",
  description:
    "Encode special characters to HTML entities or decode entities back to characters. Supports named and numeric entities.",
  keywords: [
    "html entity encoder",
    "html entity decoder",
    "html entities",
    "encode html",
    "decode html entities",
    "html special characters",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
