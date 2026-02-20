import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Color Blindness Simulator — Preview Colors for All Vision Types | DevKit",
  description:
    "Simulate how colors appear to people with color vision deficiencies: protanopia, deuteranopia, tritanopia, and more. Test accessibility of your color palettes.",
  keywords: [
    "color blindness simulator",
    "color vision deficiency",
    "protanopia",
    "deuteranopia",
    "tritanopia",
    "color accessibility",
    "a11y colors",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Color Blindness Simulator"
        description="Simulate how colors appear to people with color vision deficiencies. Free, runs locally in your browser."
        url="https://tools.elunari.uk/color-blindness-simulator"
      />
      {children}
    </>
  );
}
