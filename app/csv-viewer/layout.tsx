import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "CSV Viewer — View & Sort CSV Data Online | DevKit",
  description:
    "Paste CSV data and view it in a sortable, searchable table. Supports custom delimiters. Free, runs locally in your browser.",
  keywords: [
    "csv viewer",
    "csv table viewer online",
    "view csv data",
    "csv reader",
    "csv sorter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="CSV Viewer"
        description="View and sort CSV data in a table. Free, runs locally in your browser."
        url="https://tools.elunari.uk/csv-viewer"
      />
      {children}
    </>
  );
}
