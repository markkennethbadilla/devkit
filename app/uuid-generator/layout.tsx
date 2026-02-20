import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "UUID Generator — Generate Random v4 UUIDs Online",
  description:
    "Free UUID v4 generator. Generate unique identifiers in bulk with options for uppercase and no-dash format. Browser-based, instant results.",
  keywords: ["uuid generator", "uuid v4", "generate uuid", "random uuid", "guid generator", "unique id generator"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="UUID Generator"
        description="Free UUID v4 generator. Generate unique identifiers in bulk with options for uppercase and no-dash format. Browser-based, instant results."
        url="/uuid-generator"
      />
      {children}
    </>
  );
}
