import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "Chmod Calculator — Unix File Permissions Calculator | DevKit",
  description:
    "Calculate Unix/Linux file permissions. Convert between symbolic (rwxr-xr-x) and numeric (755) notation. Visual permission editor.",
  keywords: [
    "chmod calculator",
    "unix permissions",
    "file permissions calculator",
    "chmod 755",
    "linux permissions",
    "rwx calculator",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="Chmod Calculator"
        description="Calculate Unix file permissions with visual editor. Convert between symbolic and numeric notation."
        url="https://tools.elunari.uk/chmod-calculator"
      />
      {children}
    </>
  );
}
