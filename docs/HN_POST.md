# Hacker News Post

## Title
Show HN: DevVault Pro – 18 dev tools, 100% offline, zero tracking, runs in your browser

## URL
https://dfhhvc.github.io/devvault-pro

## Body

Hi HN,

I built DevVault Pro because I was tired of pasting JWT tokens and customer JSON into random online tools that might be logging everything.

It's a PWA with 18 developer tools that run entirely in your browser — no backend, no API calls, no analytics. You can install it as a desktop app and use it without internet.

**What's in it:**

- JSON → TypeScript interface generator (paste JSON, get TS types)
- Color converter (HEX / RGB / HSL / OKLCH with live preview)
- Text diff checker (line-by-line LCS comparison)
- JSON formatter, validator, YAML/CSV/JSONPath
- Base64, URL encode, HTML entities, Hex
- JWT decoder (with expiration check)
- Regex tester with capture group highlighting
- Hash (MD5/SHA-1/256/512), UUID, NanoID, ULID, password generator
- Unix timestamp converter, timezone comparison

**How it's different from CyberChef / it-tools:**

1. It's installable as a PWA — works fully offline, launches from desktop
2. JSON → TypeScript generation (neither CyberChef nor it-tools has this)
3. OKLCH color support (modern CSS Color 4 space)
4. Every tool is keyboard-shortcut accessible

**Privacy verification:**

Open DevTools → Network tab → use any tool → zero requests. The service worker caches everything for offline use, but no data ever leaves your browser.

**Tech:** Next.js 16, React 19, TypeScript, Tailwind 4, Vitest. All crypto uses Web Crypto API (`crypto.getRandomValues` / `crypto.subtle`). MD5 is implemented in pure JS since Web Crypto doesn't support it.

Source: https://github.com/dfhhvc/devvault-pro

I'd love feedback on the JSON → TS generation logic — it handles nested objects, arrays, unions, and optional fields. What other tools would you want?
