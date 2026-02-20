import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSS to Tailwind Converter – DevKit",
  description: "Convert plain CSS to Tailwind CSS utility classes. Supports common properties like colors, spacing, typography, flexbox, grid, and more.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
