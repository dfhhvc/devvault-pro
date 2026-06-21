/**
 * Encoding/Decoding utility tests.
 * Imports the ACTUAL source code from src/lib/encoding.ts.
 * These tests verify the real implementation, not a copy.
 */

import { describe, it, expect } from "vitest";
import {
  base64Encode,
  base64Decode,
  encodeHtmlEntities,
  decodeHtmlEntities,
  textToHex,
  hexToText,
} from "@/lib/encoding";

describe("Base64 Encoding", () => {
  it("should encode and decode ASCII text", () => {
    const original = "Hello World";
    expect(base64Decode(base64Encode(original))).toBe(original);
  });

  it("should handle Chinese characters", () => {
    const original = "\u4e2d\u6587\u6d4b\u8bd5123!@#";
    expect(base64Decode(base64Encode(original))).toBe(original);
  });

  it("should handle empty string", () => {
    expect(base64Decode(base64Encode(""))).toBe("");
  });

  it("should handle special characters including emoji", () => {
    const original = "emoji: \ud83c\udf89\ud83d\ude80\ntab\tnewline";
    expect(base64Decode(base64Encode(original))).toBe(original);
  });
});

describe("HTML Entity Encoding", () => {
  it("should encode basic HTML characters", () => {
    expect(encodeHtmlEntities("<div>")).toBe("&lt;div&gt;");
  });

  it("should encode quotes", () => {
    expect(encodeHtmlEntities('"test"')).toBe("&quot;test&quot;");
  });

  it("should encode ampersand", () => {
    expect(encodeHtmlEntities("A & B")).toBe("A &amp; B");
  });

  it("should handle XSS payloads safely", () => {
    const xss = "<script>alert(1)</script>";
    expect(encodeHtmlEntities(xss)).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });
});

describe("HTML Entity Decoding", () => {
  it("should decode basic entities", () => {
    expect(decodeHtmlEntities("&lt;div&gt;")).toBe("<div>");
  });

  it("should decode numeric entities", () => {
    expect(decodeHtmlEntities("&#60;div&#62;")).toBe("<div>");
  });

  it("should decode hex entities", () => {
    expect(decodeHtmlEntities("&#x3C;div&#x3E;")).toBe("<div>");
  });

  it("should handle unknown entities gracefully", () => {
    expect(decodeHtmlEntities("&unknown;")).toBe("&unknown;");
  });

  it("should not execute scripts (security test)", () => {
    const encoded = "&lt;script&gt;alert(1)&lt;/script&gt;";
    const decoded = decodeHtmlEntities(encoded);
    expect(decoded).toBe("<script>alert(1)</script>");
    expect(decoded).not.toContain("&lt;");
  });

  it("should round-trip encode/decode correctly", () => {
    const original = '<a href="test">Hello & Welcome</a>';
    expect(decodeHtmlEntities(encodeHtmlEntities(original))).toBe(original);
  });
});

describe("Hex Encoding", () => {
  it("should encode ASCII text", () => {
    expect(textToHex("AB")).toBe("41 42");
  });

  it("should encode Chinese characters (UTF-8)", () => {
    expect(textToHex("\u4e2d\u6587")).toBe("e4 b8 ad e6 96 87");
  });

  it("should round-trip correctly", () => {
    const original = "Hello \u4e16\u754c 123!@#";
    expect(hexToText(textToHex(original))).toBe(original);
  });

  it("should handle empty string", () => {
    expect(textToHex("")).toBe("");
    expect(hexToText("")).toBe("");
  });

  it("should throw on invalid hex length", () => {
    expect(() => hexToText("abc")).toThrow();
  });
});
