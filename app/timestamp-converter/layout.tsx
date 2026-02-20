import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Epoch to Date Online - DevKit",
  description:
    "Convert between Unix timestamps and human-readable dates. Live clock, bidirectional conversion, supports seconds and milliseconds.",
  keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "date to timestamp", "unix time converter", "epoch time"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Timestamp Converter"
        description="Convert between Unix timestamps and human-readable dates. Live clock, bidirectional conversion, supports seconds and milliseconds."
        url="/timestamp-converter"
      />
      {children}
    </>
  );
}
