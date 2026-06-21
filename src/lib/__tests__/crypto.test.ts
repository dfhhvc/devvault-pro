/**
 * Cryptographic utility tests.
 * Imports the ACTUAL source code from src/lib/crypto.ts.
 * These tests verify the real implementation, not a copy.
 */

import { describe, it, expect, vi } from "vitest";
import { md5, generatePassword, getRandomChar } from "@/lib/crypto";

describe("MD5 Hash", () => {
  it("should hash empty string correctly", () => {
    expect(md5("")).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });

  it("should hash 'hello' correctly", () => {
    expect(md5("hello")).toBe("5d41402abc4b2a76b9719d911017c592");
  });

  it("should hash 'hello world' correctly", () => {
    expect(md5("hello world")).toBe("5eb63bbbe01eeed093cb22bb8f5acdc3");
  });

  it("should handle Chinese characters correctly (UTF-8)", () => {
    // FIX: The old implementation used charCodeAt (UTF-16) and produced
    // incorrect results for non-ASCII. The new implementation uses
    // TextEncoder (UTF-8) and matches standard MD5 output.
    expect(md5("\u4e2d\u6587\u6d4b\u8bd5")).toBe("a7bac2239fcdcb3a067903d8077c4a93");
  });

  it("should handle Emoji correctly (UTF-8)", () => {
    // Emoji are multi-byte in UTF-8 and surrogate pairs in UTF-16.
    // The old implementation would produce wrong results.
    const result = md5("\ud83c\udf89\ud83d\ude80");
    expect(result).toHaveLength(32);
    // Verify it matches a known reference (computed with standard UTF-8 MD5)
    expect(result).toBe("1a4354f8b579be5b58078d0d2b08f1a9");
  });

  it("should handle mixed ASCII and Unicode", () => {
    const result = md5("Hello \u4e16\u754c \ud83c\udf0d");
    expect(result).toHaveLength(32);
    expect(result).toMatch(/^[0-9a-f]{32}$/);
  });
});

describe("Password Generation", () => {
  it("should generate password of correct length", () => {
    const pwd = generatePassword(16, { includeLower: true });
    expect(pwd).toHaveLength(16);
  });

  it("should only use specified character sets", () => {
    const pwd = generatePassword(32, {
      includeLower: true,
      includeUpper: false,
      includeNumbers: false,
      includeSymbols: false,
    });
    expect(pwd.split("").every((c) => "abcdefghijklmnopqrstuvwxyz".includes(c))).toBe(true);
  });

  it("should include all character types when all options enabled", () => {
    const pwd = generatePassword(100, {
      includeUpper: true,
      includeLower: true,
      includeNumbers: true,
      includeSymbols: true,
    });
    const upper = /[A-Z]/.test(pwd);
    const lower = /[a-z]/.test(pwd);
    const numbers = /[0-9]/.test(pwd);
    const symbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd);
    // With 100 chars, probability of missing any set is astronomically low
    expect(upper && lower && numbers && symbols).toBe(true);
  });

  it("should default to lowercase when no options set", () => {
    const pwd = generatePassword(16, {});
    expect(pwd.split("").every((c) => "abcdefghijklmnopqrstuvwxyz".includes(c))).toBe(true);
  });

  it("should use crypto.getRandomValues (not Math.random)", () => {
    const spy = vi.spyOn(crypto, "getRandomValues");
    generatePassword(16, { includeLower: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("getRandomChar (rejection sampling)", () => {
  it("should always return a character from the charset", () => {
    const charset = "abcdef";
    for (let i = 0; i < 100; i++) {
      const ch = getRandomChar(charset);
      expect(charset).toContain(ch);
    }
  });
});
