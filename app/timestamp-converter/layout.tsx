import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Epoch Time Converter Online",
  description: "Free online Unix timestamp converter. Convert between Unix epoch time and human-readable dates. Supports seconds and milliseconds. Runs in your browser.",
  keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "date to timestamp", "epoch time converter online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
