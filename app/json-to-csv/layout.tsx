import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "JSON to CSV Converter — Convert JSON Arrays to CSV Online | DevKit",
  description:
    "Convert JSON arrays to CSV format and CSV back to JSON. Handles nested objects, custom delimiters, and large datasets in the browser.",
  keywords: [
    "json to csv",
    "csv to json",
    "json converter",
    "csv converter",
    "json to csv online",
    "convert json to csv",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="JSON to CSV Converter"
        description="Convert JSON arrays to CSV format and CSV back to JSON online."
        url="https://tools.elunari.uk/json-to-csv"
      />
      {children}
    </>
  );
}
