import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder — Encode & Decode URLs Online",
  description:
    "Free URL encoder and decoder. Percent-encode special characters for URLs or decode encoded strings. Browser-based, no server required.",
  keywords: ["url encoder", "url decoder", "percent encoding", "urlencode online", "url encode decode"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="URL Encoder / Decoder"
        description="Free URL encoder and decoder. Percent-encode special characters for URLs or decode encoded strings. Browser-based, no server required."
        url="/url-encoder"
      />
      {children}
    </>
  );
}
