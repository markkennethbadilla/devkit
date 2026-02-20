import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG to CSS Converter – DevKit",
  description:
    "Convert inline SVG to a CSS background-image data URI. Optimizes the SVG and generates ready-to-use CSS with optional sizing properties.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
