import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "CSS Box Shadow Generator — Visual Editor | DevKit",
  description:
    "Create CSS box shadows visually with a live preview. Customize offset, blur, spread, color, and inset. Copy CSS instantly.",
  keywords: [
    "css box shadow generator",
    "box shadow css",
    "css shadow generator",
    "box shadow tool",
    "css shadow maker",
    "css box shadow online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="CSS Box Shadow Generator"
        description="Create CSS box shadows with a visual editor and live preview."
        url="https://tools.elunari.uk/box-shadow-generator"
      />
      {children}
    </>
  );
}
