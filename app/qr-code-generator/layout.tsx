import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "QR Code Generator — Create QR Codes Online Free | DevKit",
  description:
    "Generate QR codes from any text or URL. Customize size and download as PNG. Free, fast, client-side QR code generator.",
  keywords: [
    "qr code generator",
    "qr code maker",
    "create qr code",
    "qr code online",
    "free qr code generator",
    "text to qr code",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="QR Code Generator"
        description="Generate QR codes from text or URLs. Download as PNG."
        url="https://tools.elunari.uk/qr-code-generator"
      />
      {children}
    </>
  );
}
