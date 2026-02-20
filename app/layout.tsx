import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevKit — Free Online Developer Tools",
    template: "%s | DevKit",
  },
  description:
    "Free, fast, privacy-first developer tools. JSON formatter, Base64 encoder, UUID generator, hash generator, regex tester, and more. No ads, no tracking, runs entirely in your browser.",
  keywords: [
    "developer tools",
    "json formatter",
    "base64 encoder",
    "uuid generator",
    "hash generator",
    "regex tester",
    "online tools",
    "web developer utilities",
  ],
  openGraph: {
    title: "DevKit — Free Online Developer Tools",
    description: "Fast, free developer tools that run in your browser.",
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://tools.elunari.uk"),
  verification: {
    google: "_szgsKx7ooEKQTpv4jo2zWWFuSrJb3lfUKRyJSK1Wto",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <nav className="border-b border-[var(--border)] sticky top-0 bg-[var(--bg)]/80 backdrop-blur-md z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-lg font-bold tracking-tight">
              <span className="text-[var(--accent)]">&lt;/&gt;</span> DevKit
            </a>
            <a
              href="/"
              className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            >
              All Tools
            </a>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-[var(--border)] mt-16 py-8 text-center text-sm text-[var(--muted)]">
          <p>
            DevKit — Free developer tools. No tracking. Runs in your browser.
          </p>
          <p className="mt-2">
            <a href="/privacy" className="hover:text-[var(--fg)] transition-colors">Privacy Policy</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
