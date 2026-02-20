import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSV to JSON Converter – DevKit",
  description: "Convert CSV data to JSON arrays or objects. Supports custom delimiters, headers, and nested structures.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
