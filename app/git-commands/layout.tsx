import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Git Command Generator – DevKit",
  description: "Generate git commands from common tasks. Find the right git command for branching, merging, rebasing, stashing, and more.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
