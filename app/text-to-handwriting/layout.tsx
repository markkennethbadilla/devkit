import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text to Handwriting – DevKit",
  description: "Convert text to handwriting-style images. Customize font, color, line spacing, and paper style. Download as PNG.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
