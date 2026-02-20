import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Gradient Generator – DevKit",
  description:
    "Create beautiful CSS linear, radial, and conic gradients with a visual editor. Add color stops, adjust angles, and copy the CSS code.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
