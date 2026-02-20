# DevKit — Agent Context (Living Document)

> Last updated: 2026-02-21

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

## Current Tools (15)
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

## SEO Status
- [x] Sitemap at /sitemap.xml (17 URLs including /privacy)
- [x] Robots.txt allowing all crawlers
- [x] Google Search Console verification (HTML meta tag, auto-verified)
- [x] Sitemap submitted to Google Search Console (11 pages discovered, Status: Success)
- [x] Security review requested for false "Deceptive pages" flag (pending review)
- [x] Privacy policy at /privacy (required for AdSense)
- [x] GitHub repo: github.com/markkennethbadilla/devkit
- [ ] Re-submit sitemap (now 17 URLs vs 11 originally submitted)
- [ ] Security review pending (takes ~1-2 weeks)
- [x] Bing Webmaster Tools — site imported from GSC, sitemap processing (auto-verified)
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
- Re-submit sitemap to Google Search Console (now 17 pages)
- Submit to Bing Webmaster Tools for additional search traffic
- Wait for security review to clear (1-2 weeks)
- Apply for Google AdSense when security flag clears
- Add structured data (JSON-LD) for rich search results
- Add Open Graph images per tool
- Consider more tools: cron parser, number base converter, JSON-to-CSV, etc.
- Monitor traffic via Vercel Analytics
