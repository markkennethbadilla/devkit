import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "URL Parser – DevKit",
  description: "Parse and analyze URLs into their components: protocol, host, port, path, query parameters, and hash fragment.",
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
