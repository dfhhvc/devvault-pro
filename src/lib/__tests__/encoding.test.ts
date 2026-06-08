/**
 * Encoding/Decoding utility tests
 */

import { describe, it, expect } from "vitest";

/**
 * HTML Entity encoding
 */
function encodeHtmlEntities(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * FIXED: Pure JS HTML Entity decoding (no innerHTML)
 */
function decodeHtmlEntities(str: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: "\u00A0",
    copy: "\u00A9",
    reg: "\u00AE",
    trade: "\u2122",
    hellip: "\u2026",
    mdash: "\u2014",
    ndash: "\u2013",
    ldquo: "\u201C",
    rdquo: "\u201D",
    lsquo: "\u2018",
    rsquo: "\u2019",
  };

  return str.replace(
    /&(?:#(x?[\da-fA-F]+)|([a-zA-Z][a-zA-Z0-9]*));/g,
    (_, numeric, named) => {
      if (named) {
        return namedEntities[named] || `&${named};`;
      }
      if (numeric) {
        if (numeric.startsWith("x") || numeric.startsWith("X")) {
          return String.fromCodePoint(parseInt(numeric.slice(1), 16));
        }
        return String.fromCodePoint(parseInt(numeric, 10));
      }
      return _;
    }
  );
}

/**
 * Hex encoding/decoding
 */
function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

function hexToText(hex: string): string {
  const cleaned = hex.replace(/\s+/g, "");
  if (cleaned.length % 2 !== 0) throw new Error("Hex 长度必须为偶数");
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

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
    const xss = '<script>alert(1)</script>';
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
    // The result is text, not executable HTML
    expect(decoded).not.toContain("&lt;");
  });
});

describe("Hex Encoding", () => {
  it("should encode ASCII text", () => {
    expect(textToHex("AB")).toBe("41 42");
  });

  it("should encode Chinese characters", () => {
    expect(textToHex("中文")).toBe("e4 b8 ad e6 96 87");
  });

  it("should round-trip correctly", () => {
    const original = "Hello 世界 123!@#";
    expect(hexToText(textToHex(original))).toBe(original);
  });

  it("should handle empty string", () => {
    expect(textToHex("")).toBe("");
    expect(hexToText("")).toBe("");
  });

  it("should throw on invalid hex length", () => {
    expect(() => hexToText("abc")).toThrow("Hex 长度必须为偶数");
  });
});
