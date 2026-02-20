"use client";
import { useState, useMemo } from "react";
import useCopyToast from "@/app/hooks/useCopyToast";

const CONTROL_NAMES: Record<number, string> = {
  0: "NUL (Null)", 1: "SOH (Start of Heading)", 2: "STX (Start of Text)",
  3: "ETX (End of Text)", 4: "EOT (End of Transmission)", 5: "ENQ (Enquiry)",
  6: "ACK (Acknowledge)", 7: "BEL (Bell)", 8: "BS (Backspace)",
  9: "HT (Horizontal Tab)", 10: "LF (Line Feed)", 11: "VT (Vertical Tab)",
  12: "FF (Form Feed)", 13: "CR (Carriage Return)", 14: "SO (Shift Out)",
  15: "SI (Shift In)", 16: "DLE (Data Link Escape)", 17: "DC1 (Device Control 1)",
  18: "DC2 (Device Control 2)", 19: "DC3 (Device Control 3)",
  20: "DC4 (Device Control 4)", 21: "NAK (Negative Acknowledge)",
  22: "SYN (Synchronous Idle)", 23: "ETB (End of Transmission Block)",
  24: "CAN (Cancel)", 25: "EM (End of Medium)", 26: "SUB (Substitute)",
  27: "ESC (Escape)", 28: "FS (File Separator)", 29: "GS (Group Separator)",
  30: "RS (Record Separator)", 31: "US (Unit Separator)", 127: "DEL (Delete)",
};

interface ASCIIChar {
  dec: number;
  hex: string;
  oct: string;
  bin: string;
  char: string;
  description: string;
  category: "control" | "printable" | "extended";
}

function generateASCIITable(): ASCIIChar[] {
  const table: ASCIIChar[] = [];
  for (let i = 0; i <= 127; i++) {
    const char = i >= 32 && i <= 126 ? String.fromCharCode(i) : "";
    const description =
      CONTROL_NAMES[i] ||
      (i === 32
        ? "Space"
        : i >= 33 && i <= 47
        ? getSymbolName(i)
        : i >= 48 && i <= 57
        ? `Digit ${String.fromCharCode(i)}`
        : i >= 58 && i <= 64
        ? getSymbolName(i)
        : i >= 65 && i <= 90
        ? `Uppercase ${String.fromCharCode(i)}`
        : i >= 91 && i <= 96
        ? getSymbolName(i)
        : i >= 97 && i <= 122
        ? `Lowercase ${String.fromCharCode(i)}`
        : i >= 123 && i <= 126
        ? getSymbolName(i)
        : "");

    table.push({
      dec: i,
      hex: i.toString(16).toUpperCase().padStart(2, "0"),
      oct: i.toString(8).padStart(3, "0"),
      bin: i.toString(2).padStart(8, "0"),
      char,
      description,
      category: i < 32 || i === 127 ? "control" : "printable",
    });
  }
  return table;
}

function getSymbolName(code: number): string {
  const names: Record<number, string> = {
    33: "Exclamation mark", 34: "Double quote", 35: "Hash / Number sign",
    36: "Dollar sign", 37: "Percent", 38: "Ampersand", 39: "Single quote / Apostrophe",
    40: "Left parenthesis", 41: "Right parenthesis", 42: "Asterisk",
    43: "Plus", 44: "Comma", 45: "Hyphen / Minus", 46: "Period / Full stop",
    47: "Slash / Forward slash", 58: "Colon", 59: "Semicolon",
    60: "Less-than", 61: "Equals", 62: "Greater-than", 63: "Question mark",
    64: "At sign", 91: "Left square bracket", 92: "Backslash",
    93: "Right square bracket", 94: "Caret / Circumflex", 95: "Underscore",
    96: "Grave accent / Backtick", 123: "Left curly brace",
    124: "Vertical bar / Pipe", 125: "Right curly brace", 126: "Tilde",
  };
  return names[code] || String.fromCharCode(code);
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Control", value: "control" },
  { label: "Printable", value: "printable" },
  { label: "Letters", value: "letters" },
  { label: "Digits", value: "digits" },
  { label: "Symbols", value: "symbols" },
];

const fullTable = generateASCIITable();

export default function ASCIITablePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { copy, Toast } = useCopyToast();

  const filtered = useMemo(() => {
    let items = fullTable;

    if (filter !== "all") {
      items = items.filter((item) => {
        switch (filter) {
          case "control": return item.category === "control";
          case "printable": return item.category === "printable";
          case "letters": return (item.dec >= 65 && item.dec <= 90) || (item.dec >= 97 && item.dec <= 122);
          case "digits": return item.dec >= 48 && item.dec <= 57;
          case "symbols": return item.category === "printable" && !/[a-zA-Z0-9 ]/.test(item.char);
          default: return true;
        }
      });
    }

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.dec.toString() === q ||
          item.hex.toLowerCase() === q ||
          item.char.toLowerCase() === q ||
          item.description.toLowerCase().includes(q)
      );
    }

    return items;
  }, [search, filter]);

  const categoryColor = (item: ASCIIChar) => {
    if (item.category === "control") return "#ef4444";
    if ((item.dec >= 65 && item.dec <= 90) || (item.dec >= 97 && item.dec <= 122))
      return "#3b82f6";
    if (item.dec >= 48 && item.dec <= 57) return "#22c55e";
    return "var(--accent)";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">ASCII Table</h1>
      <p className="text-[var(--muted)] mb-6">
        Complete ASCII reference with decimal, hex, octal, and binary values.
        Click any row to copy its character code.
      </p>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code, char, or name..."
          spellCheck={false}
          className="flex-1 min-w-[200px]"
          style={{
            padding: "0.5rem 0.75rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            color: "var(--foreground)",
            fontSize: "0.9rem",
          }}
        />
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "0.35rem 0.65rem",
                fontSize: "0.8rem",
                background: filter === f.value ? "var(--accent)" : "var(--surface)",
                color: filter === f.value ? "#fff" : "var(--muted)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-[var(--muted)] mb-2">
        Showing {filtered.length} of 128 characters
      </div>

      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "left", whiteSpace: "nowrap" }}>DEC</th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>HEX</th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>OCT</th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>BIN</th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "center" }}>CHAR</th>
              <th style={{ padding: "0.5rem 0.75rem", textAlign: "left" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.dec}
                onClick={() => copy(`${item.dec} (0x${item.hex}) ${item.char || item.description}`)}
                style={{
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                title="Click to copy"
              >
                <td style={{ padding: "0.4rem 0.75rem", fontFamily: "monospace" }}>
                  {item.dec}
                </td>
                <td style={{ padding: "0.4rem 0.75rem", fontFamily: "monospace" }}>
                  0x{item.hex}
                </td>
                <td style={{ padding: "0.4rem 0.75rem", fontFamily: "monospace" }}>
                  {item.oct}
                </td>
                <td style={{ padding: "0.4rem 0.75rem", fontFamily: "monospace", letterSpacing: "0.05em" }}>
                  {item.bin}
                </td>
                <td
                  style={{
                    padding: "0.4rem 0.75rem",
                    textAlign: "center",
                    fontFamily: "monospace",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: categoryColor(item),
                  }}
                >
                  {item.char || "---"}
                </td>
                <td style={{ padding: "0.4rem 0.75rem", color: "var(--muted)" }}>
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toast />
    </div>
  );
}
