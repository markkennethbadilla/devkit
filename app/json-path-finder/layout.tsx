import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "JSON Path Finder — Query JSON with JSONPath | DevKit",
  description:
    "Query and extract data from JSON using JSONPath expressions. Live results, syntax highlighting, and path autocomplete.",
  keywords: [
    "jsonpath",
    "json path finder",
    "json query",
    "jsonpath online",
    "json path tester",
    "json path expression",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="JSON Path Finder"
        description="Query and extract JSON data using JSONPath expressions."
        url="https://tools.elunari.uk/json-path-finder"
      />
      {children}
    </>
  );
}
