import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JSON Tree Viewer – DevKit",
  description: "Explore JSON data with a collapsible interactive tree view. Expand, collapse, and navigate nested objects easily.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
