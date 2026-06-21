<div align="center">

<img src="./public/icon-192.svg" width="100" alt="DevVault Pro Logo">

# DevVault Pro

### 18 developer tools. 100% offline. Zero tracking.

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/dfhhvc/devvault-pro/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-success.svg)](src/lib/__tests__)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-installable-purple.svg)](public/manifest.json)

**[Live Demo](https://dfhhvc.github.io/devvault-pro)** · **[Features](#-features)** · **[Quick Start](#-quick-start)**

</div>

---

## Why DevVault Pro?

You paste JWT tokens, customer JSON, and passwords into online tools every day. **Where does that data go?** Most "free" tools log, analyze, or sell it.

DevVault Pro runs **entirely in your browser**. No backend, no network requests, no tracking. Your data never leaves your device.

**Verify it yourself**: Open DevTools → Network tab → use any tool → **zero requests sent**.

---

## What makes it different?

Unlike CyberChef or it-tools, DevVault Pro focuses on **modern developer workflows**:

| Feature | DevVault Pro | it-tools | CyberChef |
|---------|:-----------:|:--------:|:---------:|
| JSON → TypeScript interfaces | **Yes** | No | No |
| Color format converter (OKLCH) | **Yes** | Partial | No |
| Text diff checker | **Yes** | No | No |
| 100% client-side | **Yes** | Yes | Optional |
| Works offline (PWA) | **Yes** | No | No |
| Installable as desktop app | **Yes** | No | No |
| Zero dependencies on CDN | **Yes** | No | No |

---

## Features

### JSON Toolkit
- **JSON → TypeScript** — Auto-generate TS interfaces from JSON (unique feature)
- **Formatter** — Pretty / minify / escape / unescape
- **Validator** — Syntax check with line:column precision
- **YAML Converter** — Bidirectional JSON ↔ YAML
- **CSV Converter** — Bidirectional JSON ↔ CSV
- **JSONPath Query** — Extract nested data

### Encoding
- **Base64** — Full UTF-8 support (Chinese, Emoji)
- **URL Encode** — encodeURIComponent
- **HTML Entities** — Pure JS, zero XSS risk
- **Hex** — Text ↔ Hexadecimal

### JWT Decoder
- Parse Header, Payload, Signature
- Auto-detect expiration
- Security note: display only, no signature verification

### Regex Tester
- Real-time matching with capture group highlighting
- 8 built-in examples (email, phone, URL, IP, UUID, etc.)

### Generators
- **Hash**: MD5 / SHA-1 / SHA-256 / SHA-512
- **UUID**: v1 / v4 / NanoID / ULID
- **Password**: Cryptographically secure (`crypto.getRandomValues`)

### Time Tools
- Unix timestamp ↔ Human date
- 10 timezone real-time comparison

### Converters (new in v1.2)
- **Color Converter** — HEX ↔ RGB ↔ HSL ↔ OKLCH with live preview
- **Text Diff** — Line-by-line comparison using LCS algorithm

---

## Quick Start

### Online (fastest)
**[https://dfhhvc.github.io/devvault-pro](https://dfhhvc.github.io/devvault-pro)**

### Install as Desktop App (offline)
1. Open in Chrome/Edge
2. Click "Install" in the address bar
3. Launch from desktop — works without internet

### Local Development
```bash
git clone https://github.com/dfhhvc/devvault-pro.git
cd devvault-pro
pnpm install
pnpm dev
```

### Docker
```bash
docker build -t devvault-pro .
docker run -p 80:80 devvault-pro
```

---

## Security

| Promise | How to verify |
|---------|---------------|
| 100% client-side | F12 → Network → zero requests |
| Zero data upload | Disconnect internet → still works |
| No backend | No `/api/*` endpoints exist |
| No tracking | No Google Analytics, no pixels |
| No user data stored | No user input in localStorage/IndexedDB |
| Secure random | `crypto.getRandomValues`, not `Math.random()` |

The only thing in localStorage is your theme preference (dark/light), which is a UI setting.

---

## Tested

All tests import **actual source code** from `src/lib/`:

```bash
pnpm test
```

- Algorithm validation (MD5, SHA, Base64, Hex, Color, Diff)
- Security boundary tests (XSS prevention)
- Edge case coverage (Chinese, Emoji, empty input, deep nesting)

---

## Tech Stack

- **Next.js 16** + **React 19** + **TypeScript 5.5**
- **Tailwind CSS 4** + **shadcn/ui**
- **Vitest** for testing
- Pure JS implementations (MD5, diff, color conversion) — zero external crypto deps

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + K` | Toggle sidebar |
| `Ctrl + D` | Clear input |
| `Ctrl + Enter` | Process |
| `Ctrl + Shift + L` | Toggle theme |
| `Ctrl + /` | Help |

---

## Contributing

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new tool
fix: resolve regex highlight bug
docs: update README
```

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## License

[MIT](LICENSE) (c) 2026 DevVault Pro Contributors

---

<div align="center">

**Your data. Your browser. Period.**

[Star this project](https://github.com/dfhhvc/devvault-pro) · [Report issue](https://github.com/dfhhvc/devvault-pro/issues) · [Request feature](https://github.com/dfhhvc/devvault-pro/issues/new)

</div>
