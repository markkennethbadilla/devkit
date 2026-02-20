import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSS Units Converter – DevKit",
  description: "Convert between all CSS units: px, em, rem, pt, vh, vw, %, ch, ex, cm, mm, in, pc. Full conversion table with custom base values.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
