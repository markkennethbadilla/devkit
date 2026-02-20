import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "ASCII Table Reference — All 128 ASCII Characters | DevKit",
  description:
    "Complete ASCII table with decimal, hexadecimal, octal, binary values and character descriptions. Search, filter, and copy.",
  keywords: [
    "ascii table",
    "ascii chart",
    "ascii codes",
    "ascii reference",
    "ascii characters",
    "ascii to hex",
    "ascii to decimal",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="ASCII Table Reference"
        description="Complete ASCII table with decimal, hex, octal, binary values and descriptions."
        url="https://tools.elunari.uk/ascii-table"
      />
      {children}
    </>
  );
}
