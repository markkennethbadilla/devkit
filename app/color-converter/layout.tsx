import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Color Converter — HEX, RGB, HSL Converter Online",
  description:
    "Free color converter. Convert between HEX, RGB, and HSL formats with live preview. Instant, browser-based color conversion tool.",
  keywords: ["color converter", "hex to rgb", "rgb to hsl", "hsl to hex", "color picker", "hex color converter"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Color Converter"
        description="Free color converter. Convert between HEX, RGB, and HSL formats with live preview. Instant, browser-based color conversion tool."
        url="/color-converter"
      />
      {children}
    </>
  );
}
