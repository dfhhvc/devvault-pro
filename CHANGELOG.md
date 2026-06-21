# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-21

### Fixed
- **MD5 UTF-8 encoding bug**: MD5 now uses TextEncoder (UTF-8) instead of charCodeAt (UTF-16), producing correct hashes for Chinese characters and Emoji
- **Tests now import actual source code**: All 4 test files were rewritten to import from `src/lib/` instead of re-implementing functions inline
- **Service Worker basePath conflict**: SW now dynamically determines basePath from registration scope, fixing cache misses on GitHub Pages
- **Docker deployment broken**: basePath is now configurable via `NEXT_PUBLIC_BASE_PATH` env var, set to empty for Docker
- **PWA manifest paths**: Changed from absolute (`/icon.png`) to relative (`icon.png`) paths so they resolve correctly under any basePath
- **Naming inconsistency**: All UI titles, metadata, and manifest now consistently say "DevVault Pro" (was "DevVault" in some places)
- **Copyright year**: Fixed from 2024 to 2026
- **CI Node matrix**: Removed Node 18 (incompatible with Next.js 16), now tests Node 20 and 22

### Added
- **Error Boundary**: Tool components are now wrapped in React Error Boundary to prevent full-page white screen on errors
- **Input size limits**: All text-processing tools now warn and block processing for inputs over 5MB
- **JWT test suite**: New test file for JWT decode functionality
- **Extracted lib modules**: Pure logic extracted to `src/lib/crypto.ts`, `encoding.ts`, `json.ts`, `csv.ts`, `jwt.ts` for testability

### Changed
- **Security claim accuracy**: README now correctly notes that theme preference is stored in localStorage (was falsely claiming "Nothing in localStorage/IndexedDB")
- **SW cache version**: Bumped to v3 to invalidate old caches

## [1.0.0] - 2026-06-08

### Initial release
- 15+ developer tools (JSON, encoding, JWT, regex, hash, UUID, time)
- 100% client-side, zero data upload
- PWA offline support
- Dark/light theme
- Docker support
- 44 tests
