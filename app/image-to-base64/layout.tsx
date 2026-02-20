import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Image to Base64 Converter — Encode Images Online | DevKit",
  description:
    "Convert images to Base64 encoded strings and data URIs. Supports PNG, JPG, GIF, SVG, WebP. Paste, drag & drop, or upload files.",
  keywords: [
    "image to base64",
    "base64 image encoder",
    "image to data uri",
    "convert image to base64",
    "base64 encode image",
    "png to base64",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Image to Base64 Converter"
        description="Convert images to Base64 encoded strings and data URIs online."
        url="https://tools.elunari.uk/image-to-base64"
      />
      {children}
    </>
  );
}
