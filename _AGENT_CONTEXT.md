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
- [x] Sitemap at /sitemap.xml (12 URLs including /privacy)
- [x] Robots.txt allowing all crawlers
- [x] Google Search Console verification (HTML meta tag, auto-verified)
- [x] Sitemap submitted to Google Search Console (11 pages discovered, Status: Success)
- [x] Security review requested for false "Deceptive pages" flag (pending review)
- [x] Privacy policy at /privacy (required for AdSense)
- [x] GitHub repo: github.com/markkennethbadilla/devkit
- [ ] Security review pending (takes ~1-2 weeks)
- [ ] Bing Webmaster Tools submission
- [ ] Google AdSense application (apply when security flag clears)
- [ ] Structured data (JSON-LD) for tool pages

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
- Submit to Bing Webmaster Tools for additional search traffic
- Add more tools to increase SEO surface (markdown preview, timestamp converter, cron parser, etc.)
- Add structured data (JSON-LD) for rich search results
- Add Open Graph images per tool
- Monitor traffic via Vercel Analytics
