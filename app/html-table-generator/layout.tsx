import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTML Table Generator – DevKit",
  description: "Generate HTML tables visually. Set rows, columns, headers, and styling, then copy the generated markup.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
