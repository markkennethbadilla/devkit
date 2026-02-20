import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Emoji Picker & Search – DevKit",
  description: "Search, browse, and copy emojis by category. Find emojis by name, keyword, or category with one-click copy to clipboard.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
