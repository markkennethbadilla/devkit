import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Schema Validator – DevKit",
  description:
    "Validate JSON data against a JSON Schema. Supports draft-07 keywords including type, required, pattern, minimum/maximum, and nested schemas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
