# DevKit — Agent Context (Living Document)

> Last updated: 2026-02-22

## Overview
SEO-optimized developer tools site for passive ad revenue. All tools run client-side (privacy-first, no backend).

## Architecture
- **Framework:** Next.js 15.5.12, App Router, TypeScript, Tailwind CSS v4
- **Hosting:** Vercel free tier (project: `iammkb2002s-projects/devkit`)
- **Domain:** https://tools.elunari.uk (CNAME → cname.vercel-dns.com on Cloudflare)
- **Package manager:** Bun (aliased over npm on this machine)

## Deployment
- Deploy: `cd E:\devkit; npx vercel --prod --yes`
- Production URL: https://tools.elunari.uk
- Vercel alias: https://devkit-dusky.vercel.app (legacy)

## Current Tools (30)
1. `/json-formatter` — Format, validate, minify JSON
2. `/base64` — Encode/decode Base64
3. `/url-encoder` — URL percent-encoding
4. `/uuid-generator` — UUID v4 bulk generation
5. `/hash-generator` — SHA-256/384/512/1 via Web Crypto API
6. `/jwt-decoder` — Decode JWT with expiration check
7. `/color-converter` — HEX/RGB/HSL with live preview
8. `/regex-tester` — Live matching, highlighting, capture groups
9. `/lorem-ipsum` — Paragraphs/sentences/words generation
10. `/diff-checker` — LCS-based line diff with color coding
11. `/markdown-preview` — Write Markdown, preview rendered HTML in real time
12. `/timestamp-converter` — Unix timestamp <-> human-readable dates, live clock
13. `/css-minifier` — Minify/beautify CSS with byte savings stats
14. `/html-entity-encoder` — Encode/decode HTML entities (named + numeric)
15. `/word-counter` — Words, chars, sentences, paragraphs, reading time, top words
16. `/text-case-converter` — UPPER, lower, Title, camelCase, snake_case, kebab-case & more
17. `/password-generator` — Cryptographically secure passwords with strength meter
18. `/json-to-csv` — Convert JSON arrays to CSV and vice versa
19. `/number-base-converter` — Binary, octal, decimal, hex conversion (BigInt)
20. `/sql-formatter` — Format/beautify/minify SQL queries
21. `/cron-parser` — Parse, explain, generate cron schedules with next runs
22. `/yaml-to-json` — Convert between YAML and JSON formats
23. `/image-to-base64` — Convert images to Base64/data URIs (drag & drop)
24. `/html-to-markdown` — Convert between HTML and Markdown
25. `/text-sort-dedupe` — Sort lines, remove duplicates, trim & filter
26. `/slug-generator` — Generate clean URL slugs with Unicode support
27. `/chmod-calculator` — Visual Unix file permission calculator
28. `/http-status-codes` — Complete HTTP status code reference
29. `/string-escape` — Escape/unescape for JSON, HTML, URL, XML, Regex & more
30. `/ip-subnet-calculator` — CIDR, netmask, broadcast, host range calculator

## SEO Status
- [x] Sitemap at /sitemap.xml (32 URLs including /privacy)
- [x] Robots.txt allowing all crawlers
- [x] Google Search Console verification (HTML meta tag, auto-verified)
- [x] Sitemap submitted to Google Search Console (27 pages discovered, Status: Success)
- [x] Security review requested for false "Deceptive pages" flag (pending review)
- [x] Privacy policy at /privacy (required for AdSense)
- [x] GitHub repo: github.com/markkennethbadilla/devkit
- [ ] Security review pending (takes ~1-2 weeks)
- [x] Bing Webmaster Tools — site imported from GSC, sitemap processing (auto-verified)
- [x] JSON-LD structured data (WebSite + SoftwareApplication schemas on all 30 tool pages)
- [ ] Google AdSense application (apply when security flag clears)

## Key Files
- `app/layout.tsx` — Root layout, nav, footer, SEO metadata
- `app/page.tsx` — Homepage grid of tool cards
- `app/hooks/useCopyToast.tsx` — Shared clipboard hook
- `app/globals.css` — Dark theme, CSS variables
- `app/sitemap.ts` — Dynamic sitemap
- `app/robots.ts` — robots.txt config
- `app/icon.svg` — Favicon

## Cloudflare
- Zone ID: 8c3f9abbb9692c80eef73c1311fed53d
- Account ID: f851ceb5caf5a9255fc74cd1b3292f01
- DNS: CNAME `tools` → `cname.vercel-dns.com` (DNS only, not proxied)

## Next Steps
- Wait for security review to clear (1-2 weeks)
- Apply for Google AdSense when security flag clears
- Add Open Graph images per tool
- Consider batch 5: qr-code generator, toml-to-json, ascii-table, etc.
- Monitor traffic via Vercel Analytics
- Consider adding a second content site for more SEO surface
- Re-submit sitemap to GSC after batch 4 deploy
