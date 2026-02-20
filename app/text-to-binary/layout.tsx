import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to Binary Converter – DevKit",
  description:
    "Convert text to binary, hexadecimal, decimal, and octal representations. Also decode binary back to text.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
