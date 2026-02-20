import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "SQL Formatter — Format & Beautify SQL Queries Online | DevKit",
  description:
    "Format and beautify SQL queries online. Supports SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, and more. Indent, uppercase keywords, and clean up messy SQL.",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "format sql online",
    "sql pretty print",
    "sql indent",
    "beautify sql",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="SQL Formatter"
        description="Format and beautify SQL queries online with proper indentation and keyword uppercasing."
        url="https://tools.elunari.uk/sql-formatter"
      />
      {children}
    </>
  );
}
