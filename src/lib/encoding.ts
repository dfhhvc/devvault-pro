/**
 * Encoding and decoding utility functions.
 * All functions are pure and side-effect free, making them testable.
 */

/**
 * Base64 encode with UTF-8 support (Chinese, Emoji).
 */
export function base64Encode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  return btoa(String.fromCharCode(...utf8Bytes));
}

/**
 * Base64 decode with UTF-8 support.
 */
export function base64Decode(str: string): string {
  const binaryString = atob(str);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Encodes special HTML characters to their entity equivalents.
 * Prevents XSS by escaping <, >, ", ', and &.
 */
export function encodeHtmlEntities(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Decodes HTML entities using a pure JavaScript approach
 * instead of innerHTML, eliminating any XSS risk.
 *
 * Maps common named entities and numeric entities to characters.
 */
export function decodeHtmlEntities(str: string): string {
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
 * Converts UTF-8 text to space-separated hexadecimal representation.
 */
export function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

/**
 * Converts space-separated or continuous hexadecimal to UTF-8 text.
 * @throws Error if hex length is not even.
 */
export function hexToText(hex: string): string {
  const cleaned = hex.replace(/\s+/g, "");
  if (cleaned.length % 2 !== 0) throw new Error("Hex \u957f\u5ea6\u5fc5\u987b\u4e3a\u5076\u6570");
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}
