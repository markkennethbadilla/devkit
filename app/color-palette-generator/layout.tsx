import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palette Generator – DevKit",
  description:
    "Generate harmonious color palettes from a base color. Create complementary, analogous, triadic, and split-complementary schemes with hex, RGB, and HSL values.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
