import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Border Radius Generator – DevKit",
  description:
    "Create complex CSS border-radius values with a visual editor. Adjust individual corners, toggle circle mode, and copy the CSS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
