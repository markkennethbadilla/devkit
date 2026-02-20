import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Data URI Generator – DevKit",
  description: "Convert files to data URIs for embedding in HTML and CSS. Supports images, fonts, SVGs, and any file type. Shows Base64 size comparison.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
