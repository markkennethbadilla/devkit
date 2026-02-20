import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JavaScript Minifier – DevKit",
  description: "Minify JavaScript code by removing whitespace, comments, and shortening variable names. Compare original vs minified size.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
