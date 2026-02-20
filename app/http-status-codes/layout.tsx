import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "HTTP Status Codes Reference — Complete List with Descriptions | DevKit",
  description:
    "Complete HTTP status codes reference. Search and filter status codes by category (1xx-5xx). Learn what each status code means with descriptions and use cases.",
  keywords: [
    "http status codes",
    "http response codes",
    "status code reference",
    "http 404",
    "http 200",
    "http 500",
    "rest api status codes",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="HTTP Status Codes Reference"
        description="Complete HTTP status codes reference with descriptions and categories."
        url="https://tools.elunari.uk/http-status-codes"
      />
      {children}
    </>
  );
}
