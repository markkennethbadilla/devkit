# DevKit — Agent Context (Living Document)

> Last updated: 2026-02-20

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

## Current Tools (10)
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

## SEO Status
- [x] Sitemap at /sitemap.xml (11 URLs)
- [x] Robots.txt allowing all crawlers
- [x] Google Search Console verification meta tag deployed
- [ ] Google Search Console property verification (MCP was down, need to click Verify)
- [ ] Google AdSense (needs traffic first — apply when >1000 monthly visitors)

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
- Complete Google Search Console verification (click Verify when MCP is available)
- Add more tools to increase SEO surface area (markdown preview, timestamp converter, cron parser, etc.)
- Apply for Google AdSense when traffic builds
- Add structured data (JSON-LD) for tool pages
- Consider adding Open Graph images per tool
