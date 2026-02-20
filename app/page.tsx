import Link from "next/link";

const tools = [
  {
    name: "JSON Formatter",
    desc: "Format, validate, and minify JSON with syntax highlighting",
    href: "/json-formatter",
    icon: "{ }",
  },
  {
    name: "Base64 Encoder/Decoder",
    desc: "Encode and decode Base64 strings instantly",
    href: "/base64",
    icon: "B64",
  },
  {
    name: "URL Encoder/Decoder",
    desc: "Encode and decode URL components",
    href: "/url-encoder",
    icon: "%20",
  },
  {
    name: "UUID Generator",
    desc: "Generate random v4 UUIDs in bulk",
    href: "/uuid-generator",
    icon: "#id",
  },
  {
    name: "Hash Generator",
    desc: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes",
    href: "/hash-generator",
    icon: "#h",
  },
  {
    name: "JWT Decoder",
    desc: "Decode and inspect JSON Web Tokens",
    href: "/jwt-decoder",
    icon: "JWT",
  },
  {
    name: "Color Converter",
    desc: "Convert between HEX, RGB, and HSL color formats",
    href: "/color-converter",
    icon: "🎨",
  },
  {
    name: "Regex Tester",
    desc: "Test regular expressions with live matching and capture groups",
    href: "/regex-tester",
    icon: "/.*/" ,
  },
  {
    name: "Lorem Ipsum Generator",
    desc: "Generate placeholder text for designs and mockups",
    href: "/lorem-ipsum",
    icon: "Aa",
  },
  {
    name: "Diff Checker",
    desc: "Compare two texts side-by-side and see differences",
    href: "/diff-checker",
    icon: "±",
  },
  {
    name: "Markdown Preview",
    desc: "Write Markdown and preview rendered HTML in real time",
    href: "/markdown-preview",
    icon: "M↓",
  },
  {
    name: "Timestamp Converter",
    desc: "Convert between Unix timestamps and human-readable dates",
    href: "/timestamp-converter",
    icon: "⏱",
  },
  {
    name: "CSS Minifier",
    desc: "Compress CSS to reduce file size or beautify for readability",
    href: "/css-minifier",
    icon: "{ }",
  },
  {
    name: "HTML Entity Encoder",
    desc: "Encode and decode HTML entities and special characters",
    href: "/html-entity-encoder",
    icon: "&;",
  },
  {
    name: "Word Counter",
    desc: "Count words, characters, sentences with reading time estimate",
    href: "/word-counter",
    icon: "Wc",
  },
  {
    name: "Text Case Converter",
    desc: "Convert text between UPPER, lower, Title, camelCase, snake_case & more",
    href: "/text-case-converter",
    icon: "Aa",
  },
  {
    name: "Password Generator",
    desc: "Generate cryptographically secure random passwords",
    href: "/password-generator",
    icon: "🔑",
  },
  {
    name: "JSON to CSV",
    desc: "Convert JSON arrays to CSV and CSV back to JSON",
    href: "/json-to-csv",
    icon: "📊",
  },
  {
    name: "Number Base Converter",
    desc: "Convert between binary, octal, decimal, and hexadecimal",
    href: "/number-base-converter",
    icon: "0x",
  },
  {
    name: "SQL Formatter",
    desc: "Format, beautify, and minify SQL queries",
    href: "/sql-formatter",
    icon: "SQL",
  },
  {
    name: "Cron Expression Parser",
    desc: "Parse, explain, and generate cron schedules with next run times",
    href: "/cron-parser",
    icon: "⏰",
  },
  {
    name: "YAML to JSON",
    desc: "Convert between YAML and JSON formats instantly",
    href: "/yaml-to-json",
    icon: "Y{}",
  },
  {
    name: "Image to Base64",
    desc: "Convert images to Base64 strings and data URIs",
    href: "/image-to-base64",
    icon: "🖼",
  },
  {
    name: "HTML to Markdown",
    desc: "Convert between HTML and Markdown formats",
    href: "/html-to-markdown",
    icon: "H↓",
  },
  {
    name: "Text Sort & Dedupe",
    desc: "Sort lines, remove duplicates, trim & filter text",
    href: "/text-sort-dedupe",
    icon: "↕",
  },
  {
    name: "Slug Generator",
    desc: "Generate clean URL slugs from any text with Unicode support",
    href: "/slug-generator",
    icon: "/—",
  },
  {
    name: "Chmod Calculator",
    desc: "Visual Unix file permission calculator with octal & symbolic",
    href: "/chmod-calculator",
    icon: "rwx",
  },
  {
    name: "HTTP Status Codes",
    desc: "Complete reference of HTTP status codes with descriptions",
    href: "/http-status-codes",
    icon: "200",
  },
  {
    name: "String Escape/Unescape",
    desc: "Escape & unescape strings for JSON, HTML, URL, XML, Regex & more",
    href: "/string-escape",
    icon: "\\n",
  },
  {
    name: "IP Subnet Calculator",
    desc: "Calculate CIDR, netmask, broadcast, and host range",
    href: "/ip-subnet-calculator",
    icon: "IP",
  },
  {
    name: "QR Code Generator",
    desc: "Generate QR codes from text or URLs, download as PNG",
    href: "/qr-code-generator",
    icon: "QR",
  },
  {
    name: "JSON Path Finder",
    desc: "Query and extract JSON data using JSONPath expressions",
    href: "/json-path-finder",
    icon: "$..",
  },
  {
    name: "ASCII Table",
    desc: "Complete ASCII reference with Dec, Hex, Oct, and Binary",
    href: "/ascii-table",
    icon: "A#",
  },
  {
    name: "Box Shadow Generator",
    desc: "Create CSS box shadows visually with live preview",
    href: "/box-shadow-generator",
    icon: "[]",
  },
  {
    name: "TOML to JSON",
    desc: "Convert between TOML and JSON configuration formats",
    href: "/toml-to-json",
    icon: "T{}",
  },
  {
    name: "Gradient Generator",
    desc: "Create CSS linear, radial, and conic gradients visually",
    href: "/gradient-generator",
    icon: "G~",
  },
  {
    name: "Flexbox Playground",
    desc: "Interactive CSS Flexbox layout builder with live preview",
    href: "/flexbox-playground",
    icon: "FL",
  },
  {
    name: "Meta Tag Generator",
    desc: "Generate HTML meta tags for SEO, Open Graph, and Twitter",
    href: "/meta-tag-generator",
    icon: "<>",
  },
  {
    name: "JWT Generator",
    desc: "Create signed JSON Web Tokens with HMAC-SHA256",
    href: "/jwt-generator",
    icon: "JW",
  },
  {
    name: "SVG to CSS",
    desc: "Convert inline SVG to CSS background-image data URI",
    href: "/svg-to-css",
    icon: "SV",
  },
  {
    name: "Grid Generator",
    desc: "Create CSS Grid layouts visually with columns, rows, and gaps",
    href: "/grid-generator",
    icon: "#G",
  },
  {
    name: "Border Radius Generator",
    desc: "Visual CSS border-radius editor with presets and live preview",
    href: "/border-radius-generator",
    icon: "BR",
  },
  {
    name: "Text to Binary",
    desc: "Convert text to binary, hex, decimal, and octal representations",
    href: "/text-to-binary",
    icon: "01",
  },
  {
    name: "JSON Schema Validator",
    desc: "Validate JSON data against a JSON Schema with error details",
    href: "/json-schema-validator",
    icon: "{}",
  },
  {
    name: "Color Palette Generator",
    desc: "Generate harmonious color palettes from any base color",
    href: "/color-palette-generator",
    icon: "CP",
  },
];

export default function Home() {
  return (
    <div>
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Free Developer Tools
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto">
          Fast, free, privacy-first utilities that run entirely in your browser.
          No data leaves your machine.
        </p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="tool-card block group">
            <div className="text-2xl font-mono mb-3 text-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity">
              {t.icon}
            </div>
            <h2 className="text-lg font-semibold mb-1">{t.name}</h2>
            <p className="text-sm text-[var(--muted)]">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
