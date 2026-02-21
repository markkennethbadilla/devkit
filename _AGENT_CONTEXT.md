# DevKit — Agent Context (Living Document)

> Last updated: 2026-02-21

## Overview
SEO-optimized developer tools site for passive ad revenue. All tools run client-side (privacy-first, no backend).

## Architecture
- **Framework:** Next.js 15.5.12, App Router, TypeScript, Tailwind CSS v4
- **Hosting:** Vercel free tier (project: `iammkb2002s-projects/devkit`)
- **Domains:** https://tools.elunari.uk + https://elunari.uk (root domain alias)
- **Package manager:** Bun (aliased over npm on this machine)

## Deployment
- Deploy: `cd E:\devkit; npx vercel --prod --yes`
- Production URLs: https://tools.elunari.uk, https://elunari.uk
- Vercel alias: https://devkit-dusky.vercel.app (legacy)

## Monetization
- **Google AdSense:** Publisher ID `pub-7465302364385209` (account: iammkb2002@gmail.com)
  - Site: elunari.uk — VERIFIED ✅, review requested, status: "Getting ready"
  - AdSense script in `<head>` of layout.tsx
  - ads.txt at `/ads.txt` (public/ads.txt)
  - Google CMP consent message enabled (2-choice: Consent + Manage options)
  - Payment info: INCOMPLETE (needs user's physical address)
- **Buy Me a Coffee:** buymeacoffee.com/moonlitcapy (account: iammkb2002@gmail.com)
  - Footer link: "☕ Support DevKit"
  - Profile setup: INCOMPLETE (needs profile picture — Playwright can't upload files)

## Current Tools (85)
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
31. `/qr-code-generator` — Generate QR codes from text/URLs, download as PNG
32. `/json-path-finder` — Query JSON data with JSONPath expressions
33. `/ascii-table` — Complete ASCII reference (Dec/Hex/Oct/Bin)
34. `/box-shadow-generator` — Visual CSS box shadow editor with presets
35. `/toml-to-json` — Convert between TOML and JSON formats
36. `/gradient-generator` — CSS linear, radial, conic gradient builder
37. `/flexbox-playground` — Interactive CSS Flexbox layout builder
38. `/meta-tag-generator` — HTML meta tags for SEO, Open Graph, Twitter
39. `/jwt-generator` — Create signed JWTs with HMAC-SHA256
40. `/svg-to-css` — Convert SVG to CSS background-image data URI
41. `/grid-generator` — CSS Grid layout builder with visual preview
42. `/border-radius-generator` — Visual CSS border-radius editor
43. `/text-to-binary` — Text to binary/hex/decimal/octal converter
44. `/json-schema-validator` — Validate JSON against JSON Schema
45. `/color-palette-generator` — Generate color palettes from base color
46. `/aspect-ratio-calculator` — Calculate aspect ratios, resize proportionally
47. `/csv-to-json` — Convert CSV to JSON with custom delimiters
48. `/html-preview` — Live HTML/CSS/JS preview sandbox
49. `/base-converter` — Convert numbers between any base (2-36)
50. `/pixel-to-rem` — Convert CSS px to rem/em units
51. `/http-headers` — HTTP headers reference with examples
52. `/css-units-converter` — Convert between all CSS units
53. `/data-uri-generator` — Convert files to Base64 data URIs
54. `/tailwind-converter` — CSS to Tailwind utility classes
55. `/emoji-picker` — Search and copy emojis by category
56. `/json-compare` — Deep-compare two JSON objects, highlight differences
57. `/og-preview` — Preview Open Graph tags for social media
58. `/git-commands` — Git command reference with search and categories
59. `/placeholder-image` — Generate placeholder images with custom dimensions
60. `/crontab-generator` — Visual cron expression builder
61. `/css-clip-path` — CSS clip-path shapes with presets and live preview
62. `/html-table-generator` — Build HTML tables visually with inline editing
63. `/json-tree-viewer` — Collapsible JSON tree viewer with path copying
64. `/text-to-handwriting` — Convert text to handwriting-style images
65. `/url-parser` — Parse URLs into components
66. `/character-counter` — Character/word counter with frequency analysis
67. `/css-animation-generator` — CSS keyframe animation builder with live preview
68. `/env-generator` — .env file builder with templates and sections
69. `/image-compressor` — Client-side image compression with quality controls
70. `/js-minifier` — JavaScript minifier/beautifier with size comparison
71. `/xml-formatter` — Format, beautify, and minify XML documents
72. `/color-blindness-simulator` — Preview colors for different vision types
73. `/json-to-typescript` — Generate TypeScript interfaces from JSON
74. `/string-hash` — Hash text with MD5, SHA-1, SHA-256, SHA-384, SHA-512
75. `/responsive-tester` — Preview websites at different screen sizes
76. `/json-to-yaml` — Convert between JSON and YAML formats
77. `/css-filter-generator` — Visual CSS filter editor with presets
78. `/text-repeater` — Repeat text N times with separators
79. `/htaccess-generator` — Generate Apache .htaccess rules
80. `/typescript-to-json` — Generate sample JSON from TypeScript interfaces
81. `/html-minifier` — Minify HTML by removing whitespace, comments, and optional tags
82. `/jwt-builder` — Build JSON Web Tokens by selecting claims and algorithm
83. `/csv-viewer` — View and sort CSV data in a searchable table
84. `/base32-encoder` — Encode and decode Base32 strings (RFC 4648)
85. `/xml-to-json` — Convert XML to JSON and JSON to XML

## SEO Status
- [x] Sitemap at /sitemap.xml (87 URLs including /privacy)
- [x] Robots.txt allowing all crawlers
- [x] Google Search Console verification (HTML meta tag, auto-verified)
- [x] Sitemap submitted to Google Search Console (27 pages discovered, Status: Success)
- [x] Security review requested for false "Deceptive pages" flag (pending review)
- [x] Privacy policy at /privacy (required for AdSense)
- [x] GitHub repo: github.com/markkennethbadilla/devkit
- [ ] Security review pending (takes ~1-2 weeks)
- [x] Bing Webmaster Tools — site imported from GSC, sitemap processing (auto-verified)
- [x] JSON-LD structured data (WebSite + SoftwareApplication schemas on all 85 tool pages)
- [x] IndexNow submitted (87 URLs) for faster Bing indexing
- [x] IndexNow key file at /e7f3a9b2d4c6e8f0a1b3c5d7e9f1a3b5.txt
- [x] Google AdSense — applied, site verified, review requested (status: Getting ready)

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
- DNS: CNAME `@` → `cname.vercel-dns.com` (root domain, DNS only)

## Next Steps
- Wait for AdSense review to complete (can take days/weeks)
- Complete AdSense payment info (user needs to enter address)
- Complete BMC profile setup (user needs to upload profile picture)
- Wait for security review to clear (1-2 weeks)
- Add Open Graph images per tool
- Monitor traffic via Vercel Analytics
- Consider adding Gumroad digital products, affiliate links
