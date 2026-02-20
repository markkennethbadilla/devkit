import type { Metadata } from "next";
import ToolJsonLd from "@/app/components/ToolJsonLd";

export const metadata: Metadata = {
  title: "IP Subnet Calculator — CIDR, Netmask, Network Range | DevKit",
  description:
    "Calculate IP subnet information including network address, broadcast address, usable range, netmask, wildcard mask, and number of hosts.",
  keywords: [
    "ip subnet calculator",
    "cidr calculator",
    "subnet mask calculator",
    "network calculator",
    "ip address calculator",
    "subnet calculator online",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd
        name="IP Subnet Calculator"
        description="Calculate IP subnet details including CIDR, netmask, broadcast, and host range."
        url="https://tools.elunari.uk/ip-subnet-calculator"
      />
      {children}
    </>
  );
}
