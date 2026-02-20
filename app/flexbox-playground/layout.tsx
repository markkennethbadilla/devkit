import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Flexbox Playground – DevKit",
  description:
    "Interactive CSS Flexbox playground. Experiment with flex-direction, justify-content, align-items, gap, wrap, and more. Copy the generated CSS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
