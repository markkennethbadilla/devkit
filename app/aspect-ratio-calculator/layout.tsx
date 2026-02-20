import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator – DevKit",
  description:
    "Calculate aspect ratios, resize dimensions proportionally, and find common display ratios. Convert between width, height, and ratio formats.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
