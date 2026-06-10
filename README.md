<div align="center">

<img src="./public/icon-192.png" width="80" alt="DevVault Pro Logo">

# 🔒 DevVault Pro

**Your data never leaves your browser**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/dfhhvc/devvault-pro/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-44%20passing-success.svg)](src/lib/__tests__)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)](https://tailwindcss.com/)

[🚀 Try it now](https://dfhhvc.github.io/devvault-pro) · [📖 Features](#-what-you-get) · [⚡ Quick Start](#-quick-start) · [🤝 Contribute](#-contributing)

</div>

---

## 🚨 The Problem

Every day, developers paste sensitive data into online tools:

- **JWT tokens** from production APIs
- **Customer JSON data** for formatting
- **Private regex patterns** for testing
- **Passwords** into online generators

**Where does that data go?** Most "free" tools log, analyze, or sell it.

---

## ✅ The Solution

**DevVault Pro** — 15+ developer tools that run **entirely in your browser**.

| Feature | DevVault Pro | Typical Online Tool |
|---------|-------------|---------------------|
| Data leaves your device | ❌ **Never** | ✅ Yes |
| Works offline | ✅ **PWA** | ❌ No |
| Open source | ✅ **Fully** | ❌ No |
| No ads / tracking | ✅ **Zero** | ❌ Ads + trackers |
| Free forever | ✅ **MIT License** | ❌ Freemium |

**Verify it yourself**: Open DevTools → Network tab → use any tool → **zero requests sent**.

---

## 🎁 What You Get

### 📁 JSON Toolkit
- **Formatter** — Pretty / minify / escape / unescape
- **Validator** — Syntax check with line:column precision
- **YAML Converter** — Bidirectional JSON ↔ YAML
- **CSV Converter** — Bidirectional JSON ↔ CSV
- **JSONPath Query** — Extract nested data with expressions

### 🔐 Encoding
- **Base64** — Full UTF-8 support (Chinese, Emoji)
- **URL Encode** — encodeURIComponent
- **HTML Entities** — Pure JS, zero XSS risk
- **Hex** — Text ↔ Hexadecimal

### 🎫 JWT Decoder
- Parse Header, Payload, Signature
- Auto-detect expiration
- ⚠️ **Security note**: Displays only, does not verify signatures

### 🎯 Regex Tester
- Real-time matching with capture group highlighting
- 8 built-in examples: email, phone, URL, IP, UUID, etc.

### #️⃣ Generators
- **Hash**: MD5 / SHA-1 / SHA-256 / SHA-512
- **UUID**: v1 / v4
- **NanoID**: Configurable length
- **ULID**: Sortable unique IDs
- **Password**: Cryptographically secure (`crypto.getRandomValues`)

### ⏰ Time Tools
- Unix timestamp ↔ Human date
- 10 timezone real-time comparison

---

## 🛡️ Security You Can Verify

| Promise | How to Check |
|---------|-------------|
| 100% client-side | F12 → Network → zero requests |
| Zero data upload | Disconnect internet → still works |
| No backend | No `/api/*` endpoints exist |
| No tracking | No Google Analytics, no pixels |
| Memory-only | Nothing in localStorage/IndexedDB |
| Secure random | Uses `crypto.getRandomValues`, not `Math.random()` |

---

## 🚀 Quick Start

### Online (fastest)
👉 **[https://dfhhvc.github.io/devvault-pro](https://dfhhvc.github.io/devvault-pro)**

### Install as App (offline)
1. Open in Chrome/Edge
2. Click **"Install"** in address bar
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
docker run -p 3000:3000 devvault-pro
```

---

## 🧪 Tested & Trusted

```bash
pnpm test
```

- ✅ **44 tests** passing
- ✅ Algorithm validation
- ✅ Security boundary tests
- ✅ XSS prevention verified

---

## 🏗️ Tech Stack

- **Next.js 16** + **React 19** + **TypeScript 5.5**
- **Tailwind CSS 4** + **shadcn/ui**
- **Vitest** for testing
- Deployed on **GitHub Pages**

---

## 📸 Preview

<div align="center">

| Desktop | Mobile |
|---------|--------|
| ![Desktop](./public/screenshot-wide.svg) | ![Mobile](./public/screenshot-narrow.svg) |

</div>

---

## 🆚 DevVault Pro vs Original

| Feature | Original | Pro |
|---------|----------|-----|
| Service Worker | ⚠️ Partial | ✅ Stale-While-Revalidate |
| JWT warnings | ⚠️ Confusing | ✅ Clear "display-only" notice |
| Regex highlight | ⚠️ Buggy groups | ✅ Accurate indexing |
| Password gen | ⚠️ Biased | ✅ Rejection sampling |
| HTML decode | ⚠️ `innerHTML` | ✅ Pure JS |
| Tests | ❌ None | ✅ 44 tests |
| Docker | ❌ None | ✅ Ready |

---

## ⌨️ Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + K` | Toggle sidebar |
| `Ctrl + D` | Clear input |
| `Ctrl + Enter` | Process |
| `Ctrl + Shift + L` | Toggle theme |
| `Ctrl + /` | Help |

---

## 🤝 Contributing

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new tool
fix: resolve regex highlight bug
docs: update README
```

1. Fork → `feat/your-feature` → PR

See [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 License

[MIT](LICENSE) © 2024 DevVault Pro Contributors

---

<div align="center">

**🔒 Your data. Your browser. Period.**

[⭐ Star this project](https://github.com/dfhhvc/devvault-pro) · [🐛 Report issue](https://github.com/dfhhvc/devvault-pro/issues) · [💡 Suggest feature](https://github.com/dfhhvc/devvault-pro/discussions)

</div>
