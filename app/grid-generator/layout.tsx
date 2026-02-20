import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Grid Generator – DevKit",
  description:
    "Create CSS Grid layouts visually. Set columns, rows, gaps, and template areas. Preview the grid and copy the generated CSS code.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
