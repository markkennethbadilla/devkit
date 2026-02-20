import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "PX to REM Converter – DevKit",
  description: "Convert between CSS px, rem, and em units. Set a custom base font size and see a full conversion table.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
