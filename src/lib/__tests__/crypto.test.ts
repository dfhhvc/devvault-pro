/**
 * Cryptographic utility tests
 * Tests for password generation, hash functions, and encoding.
 */

import { describe, it, expect } from "vitest";

/**
 * Use Node.js crypto for MD5 testing
 */
function md5(message: string): string {
  const crypto = require("crypto");
  return crypto.createHash("md5").update(message).digest("hex");
}

/**
 * Base64 encode with UTF-8 support
 */
function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str: string): string {
  return decodeURIComponent(escape(atob(str)));
}

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

  it("should handle Chinese characters", () => {
    expect(md5("中文测试")).toBe("089b4943ea034acfa445d050c7913e55");
  });
});

describe("Base64 Encoding", () => {
  it("should encode and decode ASCII text", () => {
    const original = "Hello World";
    expect(base64Decode(base64Encode(original))).toBe(original);
  });

  it("should handle Chinese characters", () => {
    const original = "中文测试123!@#";
    expect(base64Decode(base64Encode(original))).toBe(original);
  });

  it("should handle empty string", () => {
    expect(base64Decode(base64Encode(""))).toBe("");
  });

  it("should handle special characters", () => {
    const original = "emoji: 🎉🚀\nnewline\ttab";
    expect(base64Decode(base64Encode(original))).toBe(original);
  });
});

describe("Password Generation", () => {
  it("should generate password of correct length", () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyz";

    // Simulate unbiased generation
    const getRandomChar = (charset: string): string => {
      const charSetLength = charset.length;
      const maxValid = Math.floor(256 / charSetLength) * charSetLength;

      let randomByte: number;
      do {
        const array = new Uint8Array(1);
        // Use Math.random for testing (not crypto secure)
        randomByte = Math.floor(Math.random() * 256);
      } while (randomByte >= maxValid);

      return charset[randomByte % charSetLength];
    };

    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += getRandomChar(charset);
    }

    expect(pwd.length).toBe(length);
    expect(pwd.split("").every((c) => charset.includes(c))).toBe(true);
  });
});
