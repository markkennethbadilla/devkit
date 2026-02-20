import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "CSS Filter Generator — Visual CSS Filter Editor | DevKit",
  description:
    "Build CSS filter effects visually: blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia. Live preview with code output.",
  keywords: [
    "css filter generator",
    "css filter editor",
    "blur filter css",
    "brightness contrast css",
    "grayscale css",
    "css filter builder",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="CSS Filter Generator"
        description="Build CSS filter effects visually with blur, brightness, contrast, and more. Free, runs locally."
        url="https://tools.elunari.uk/css-filter-generator"
      />
      {children}
    </>
  );
}
