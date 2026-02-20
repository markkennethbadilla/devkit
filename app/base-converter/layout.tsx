import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Base Converter (2-36) – DevKit",
  description: "Convert numbers between any base from 2 (binary) to 36. Supports integers and shows conversions to all common bases simultaneously.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
