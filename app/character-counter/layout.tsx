import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Character Counter – DevKit",
  description: "Count characters, words, and analyze character frequency distribution. UTF-8 aware with detailed statistics.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
