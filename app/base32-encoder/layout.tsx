import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Base32 Encoder/Decoder — Encode & Decode Base32 Online | DevKit",
  description:
    "Encode text to Base32 or decode Base32 strings instantly. Supports RFC 4648 standard. Free, runs locally in your browser.",
  keywords: [
    "base32 encoder",
    "base32 decoder",
    "base32 encode online",
    "base32 decode online",
    "base32 converter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Base32 Encoder/Decoder"
        description="Encode and decode Base32 strings. Free, runs locally in your browser."
        url="https://tools.elunari.uk/base32-encoder"
      />
      {children}
    </>
  );
}
