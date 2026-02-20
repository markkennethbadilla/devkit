import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Number Base Converter — Binary, Octal, Decimal, Hex | DevKit",
  description:
    "Convert numbers between binary, octal, decimal, and hexadecimal bases. Supports integers of any size with real-time conversion.",
  keywords: [
    "number base converter",
    "binary converter",
    "hex converter",
    "decimal to binary",
    "decimal to hex",
    "octal converter",
    "base converter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Number Base Converter"
        description="Convert numbers between binary, octal, decimal, and hexadecimal bases instantly."
        url="https://tools.elunari.uk/number-base-converter"
      />
      {children}
    </>
  );
}
