import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Open Graph Preview – DevKit",
  description: "Preview how your website will look when shared on Twitter, Facebook, LinkedIn, and other platforms. Test Open Graph and Twitter Card meta tags.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
