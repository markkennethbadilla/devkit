"use client";

import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

function ipToLong(ip: string): number {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255))
    return -1;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function longToIp(n: number): string {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join(".");
}

function cidrToMask(cidr: number): number {
  if (cidr === 0) return 0;
  return (~0 << (32 - cidr)) >>> 0;
}

function maskToCidr(mask: number): number {
  let bits = 0;
  let m = mask;
  while (m & 0x80000000) {
    bits++;
    m = (m << 1) >>> 0;
  }
  return bits;
}

function isValidMask(mask: number): boolean {
  if (mask === 0) return true;
  const inv = (~mask) >>> 0;
  return ((inv & (inv + 1)) >>> 0) === 0;
}

function ipClass(ip: number): string {
  const first = (ip >>> 24) & 255;
  if (first < 128) return "A";
  if (first < 192) return "B";
  if (first < 224) return "C";
  if (first < 240) return "D (Multicast)";
  return "E (Reserved)";
}

function isPrivate(ip: number): boolean {
  const first = (ip >>> 24) & 255;
  const second = (ip >>> 16) & 255;
  if (first === 10) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  return false;
}

interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  subnetMask: string;
  wildcardMask: string;
  cidr: number;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  isPrivate: boolean;
  binaryMask: string;
  binaryIp: string;
}

function calculateSubnet(ipStr: string, cidr: number): SubnetInfo | null {
  const ip = ipToLong(ipStr);
  if (ip === -1 || cidr < 0 || cidr > 32) return null;

  const mask = cidrToMask(cidr);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2;
  const firstUsable = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastUsable = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;
  const wildcard = (~mask) >>> 0;

  const toBin = (n: number) =>
    [
      ((n >>> 24) & 255).toString(2).padStart(8, "0"),
      ((n >>> 16) & 255).toString(2).padStart(8, "0"),
      ((n >>> 8) & 255).toString(2).padStart(8, "0"),
      (n & 255).toString(2).padStart(8, "0"),
    ].join(".");

  return {
    networkAddress: longToIp(network),
    broadcastAddress: longToIp(broadcast),
    firstUsable: longToIp(firstUsable),
    lastUsable: longToIp(lastUsable),
    subnetMask: longToIp(mask),
    wildcardMask: longToIp(wildcard),
    cidr,
    totalHosts,
    usableHosts,
    ipClass: ipClass(ip),
    isPrivate: isPrivate(ip),
    binaryMask: toBin(mask),
    binaryIp: toBin(ip),
  };
}

const commonSubnets = [
  { cidr: 8, label: "/8 — 16M hosts" },
  { cidr: 16, label: "/16 — 65K hosts" },
  { cidr: 20, label: "/20 — 4094 hosts" },
  { cidr: 24, label: "/24 — 254 hosts" },
  { cidr: 25, label: "/25 — 126 hosts" },
  { cidr: 26, label: "/26 — 62 hosts" },
  { cidr: 27, label: "/27 — 30 hosts" },
  { cidr: 28, label: "/28 — 14 hosts" },
  { cidr: 29, label: "/29 — 6 hosts" },
  { cidr: 30, label: "/30 — 2 hosts" },
  { cidr: 31, label: "/31 — 2 P2P" },
  { cidr: 32, label: "/32 — 1 host" },
];

export default function IpSubnetCalculatorPage() {
  const [ip, setIp] = useState("192.168.1.0");
  const [cidr, setCidr] = useState(24);
  const [maskInput, setMaskInput] = useState("");
  const { copy, Toast } = useCopyToast();

  const result = useMemo(() => calculateSubnet(ip, cidr), [ip, cidr]);

  const handleMaskInput = (val: string) => {
    setMaskInput(val);
    const maskLong = ipToLong(val);
    if (maskLong !== -1 && isValidMask(maskLong)) {
      setCidr(maskToCidr(maskLong));
    }
  };

  const handleCidrChange = (val: number) => {
    setCidr(val);
    setMaskInput(longToIp(cidrToMask(val)));
  };

  const handleCidrInput = (val: string) => {
    // Support "192.168.1.0/24" format
    if (val.includes("/")) {
      const [ipPart, cidrPart] = val.split("/");
      if (ipPart && ipToLong(ipPart) !== -1) setIp(ipPart);
      const c = parseInt(cidrPart);
      if (!isNaN(c) && c >= 0 && c <= 32) handleCidrChange(c);
    }
  };

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          color: "var(--foreground)",
        }}
      >
        IP Subnet Calculator
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Calculate network address, broadcast, usable range, and host count from
        IP and CIDR/subnet mask.
      </p>

      {/* Input */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: "0.85rem",
              color: "var(--muted)",
            }}
          >
            IP Address
          </label>
          <input
            value={ip}
            onChange={(e) => {
              setIp(e.target.value);
              handleCidrInput(e.target.value);
            }}
            placeholder="192.168.1.0 or 192.168.1.0/24"
            spellCheck={false}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--foreground)",
              fontSize: "1rem",
              fontFamily: "monospace",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 4,
              fontSize: "0.85rem",
              color: "var(--muted)",
            }}
          >
            CIDR / Prefix Length
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span
              style={{
                padding: "0.6rem 0.5rem",
                color: "var(--muted)",
                fontSize: "1rem",
              }}
            >
              /
            </span>
            <input
              type="number"
              min={0}
              max={32}
              value={cidr}
              onChange={(e) => handleCidrChange(parseInt(e.target.value) || 0)}
              style={{
                width: 80,
                padding: "0.6rem 0.75rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--foreground)",
                fontSize: "1rem",
                fontFamily: "monospace",
              }}
            />
            <input
              value={maskInput || (result ? result.subnetMask : "")}
              onChange={(e) => handleMaskInput(e.target.value)}
              placeholder="255.255.255.0"
              spellCheck={false}
              style={{
                flex: 1,
                padding: "0.6rem 0.75rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--foreground)",
                fontSize: "0.9rem",
                fontFamily: "monospace",
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick presets */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.4rem",
          marginBottom: "2rem",
        }}
      >
        {commonSubnets.map((s) => (
          <button
            key={s.cidr}
            onClick={() => handleCidrChange(s.cidr)}
            style={{
              padding: "0.3rem 0.6rem",
              fontSize: "0.75rem",
              background: cidr === s.cidr ? "var(--accent)" : "var(--surface)",
              color: cidr === s.cidr ? "#fff" : "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {result ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {[
              { label: "Network Address", value: result.networkAddress },
              { label: "Broadcast Address", value: result.broadcastAddress },
              { label: "First Usable Host", value: result.firstUsable },
              { label: "Last Usable Host", value: result.lastUsable },
              { label: "Subnet Mask", value: result.subnetMask },
              { label: "Wildcard Mask", value: result.wildcardMask },
              { label: "CIDR Notation", value: `${result.networkAddress}/${result.cidr}` },
              {
                label: "Total Hosts",
                value: result.totalHosts.toLocaleString(),
              },
              {
                label: "Usable Hosts",
                value: result.usableHosts.toLocaleString(),
              },
              { label: "IP Class", value: result.ipClass },
              {
                label: "Private",
                value: result.isPrivate ? "Yes (RFC 1918)" : "No (Public)",
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => copy(item.value)}
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "border-color 0.15s",
                }}
                title="Click to copy"
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    marginBottom: 4,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontFamily: "monospace",
                    color: "var(--foreground)",
                    wordBreak: "break-all",
                  }}
                >
                  {item.value}
                </div>
              </button>
            ))}
          </div>

          {/* Binary representations */}
          <div
            style={{
              padding: "1rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--foreground)",
                marginBottom: "0.75rem",
              }}
            >
              Binary Representation
            </div>
            {[
              { label: "IP Address", value: result.binaryIp },
              { label: "Subnet Mask", value: result.binaryMask },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.4rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                    minWidth: 100,
                  }}
                >
                  {item.label}
                </span>
                <code
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                  onClick={() => copy(item.value)}
                  title="Click to copy"
                >
                  {item.value}
                </code>
              </div>
            ))}
          </div>

          {/* All /cidr table */}
          <details style={{ marginTop: "0.5rem" }}>
            <summary
              style={{
                cursor: "pointer",
                color: "var(--accent)",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              CIDR Reference Table
            </summary>
            <div
              style={{
                overflowX: "auto",
                border: "1px solid var(--border)",
                borderRadius: 8,
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.8rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "var(--surface)",
                      color: "var(--muted)",
                    }}
                  >
                    <th style={{ padding: "0.4rem 0.6rem", textAlign: "left" }}>
                      CIDR
                    </th>
                    <th style={{ padding: "0.4rem 0.6rem", textAlign: "left" }}>
                      Subnet Mask
                    </th>
                    <th
                      style={{ padding: "0.4rem 0.6rem", textAlign: "right" }}
                    >
                      Total Addresses
                    </th>
                    <th
                      style={{ padding: "0.4rem 0.6rem", textAlign: "right" }}
                    >
                      Usable Hosts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 33 }, (_, i) => i).map((c) => {
                    const total = Math.pow(2, 32 - c);
                    const usable = c >= 31 ? (c === 32 ? 1 : 2) : total - 2;
                    return (
                      <tr
                        key={c}
                        onClick={() => handleCidrChange(c)}
                        style={{
                          cursor: "pointer",
                          background:
                            c === cidr ? "var(--accent)" : "transparent",
                          color: c === cidr ? "#fff" : "var(--foreground)",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <td
                          style={{
                            padding: "0.3rem 0.6rem",
                            fontFamily: "monospace",
                          }}
                        >
                          /{c}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.6rem",
                            fontFamily: "monospace",
                          }}
                        >
                          {longToIp(cidrToMask(c))}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.6rem",
                            textAlign: "right",
                            fontFamily: "monospace",
                          }}
                        >
                          {total.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "0.3rem 0.6rem",
                            textAlign: "right",
                            fontFamily: "monospace",
                          }}
                        >
                          {usable < 0 ? 0 : usable.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      ) : (
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "2rem" }}>
          Enter a valid IP address to see subnet information.
        </p>
      )}

      <Toast />
    </main>
  );
}
