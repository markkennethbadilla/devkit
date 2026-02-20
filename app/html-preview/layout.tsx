import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Live HTML Preview – DevKit",
  description: "Write HTML, CSS, and JavaScript and see a live preview instantly. Mini CodePen-like sandbox for quick prototyping.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
