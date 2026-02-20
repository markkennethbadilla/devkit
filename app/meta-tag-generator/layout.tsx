import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tag Generator – DevKit",
  description:
    "Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview how your page will appear in search results and social media.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
