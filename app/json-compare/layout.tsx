import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JSON Compare & Diff – DevKit",
  description: "Deep compare two JSON objects and see differences highlighted. Find added, removed, and changed values with path information.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
