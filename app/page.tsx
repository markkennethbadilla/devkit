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
