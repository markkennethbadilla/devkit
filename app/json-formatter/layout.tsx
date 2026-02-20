import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Format, Minify, Validate JSON Online",
  description:
    "Free online JSON formatter, validator, and minifier. Pretty-print or compress JSON data instantly. Runs in your browser — no data sent to servers.",
  keywords: [
    "json formatter",
    "json validator",
    "json minifier",
    "pretty print json",
    "format json online",
    "json beautifier",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
