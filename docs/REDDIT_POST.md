# Reddit Post

## Subreddit
r/webdev (or r/programmingtools, r/SideProject)

## Title
I built 18 developer tools that run 100% offline in your browser — no tracking, no backend, installable as PWA

## Body

I kept pasting sensitive data (JWT tokens, API keys, customer JSON) into random online tools and wondering where that data ended up. So I built DevVault Pro.

**What it is:** A PWA with 18 developer tools. Everything runs client-side. No backend, no API, no analytics. You can install it as a desktop app and use it offline.

**Tools included:**
- 🔧 JSON → TypeScript (paste JSON, get TS interfaces — this is the killer feature for me)
- 🎨 Color converter (HEX/RGB/HSL/OKLCH with live preview)
- 📝 Text diff checker (LCS algorithm, line-by-line)
- 📋 JSON formatter/validator/YAML/CSV/JSONPath
- 🔐 Base64, URL, HTML entities, Hex encoding
- 🎫 JWT decoder with expiration detection
- 🔍 Regex tester with capture groups
- #️⃣ Hash (MD5/SHA-1/256/512), UUID, NanoID, ULID, password gen
- ⏰ Timestamp converter, timezone comparison

**How it compares:**

| | DevVault Pro | it-tools | CyberChef |
|---|---|---|---|
| JSON → TS | ✅ | ❌ | ❌ |
| OKLCH color | ✅ | Partial | ❌ |
| Text diff | ✅ | ❌ | ❌ |
| Offline PWA | ✅ | ❌ | ❌ |
| Tool count | 18 | 40+ | 300+ |

It-tools and CyberChef have more tools overall, but DevVault Pro has the JSON→TS generator and works as an installable offline app.

**Privacy:** Open DevTools → Network → use any tool → literally zero network requests. The only localStorage entry is your theme preference.

**Tech stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Vitest. All tests import actual source code (not copies).

**Links:**
- Live: https://dfhhvc.github.io/devvault-pro
- Source: https://github.com/dfhhvc/devvault-pro

What tools should I add next? I'm considering:
- Cron expression parser
- QR code generator
- Markdown preview
- HTTP status code reference

Feedback welcome, especially on the JSON→TS generation logic.
