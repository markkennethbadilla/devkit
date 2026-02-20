import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Image Compressor – DevKit",
  description: "Compress and resize images client-side using Canvas API. Adjust quality, resize dimensions, and download optimized images.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
