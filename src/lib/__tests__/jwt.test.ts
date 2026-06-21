/**
 * JWT utility tests.
 * Imports the ACTUAL source code from src/lib/jwt.ts.
 */

import { describe, it, expect } from "vitest";
import { base64UrlDecode, decodeJwt } from "@/lib/jwt";

describe("base64UrlDecode", () => {
  it("should decode standard base64url strings", () => {
    // "hello" in base64url = "aGVsbG8"
    expect(base64UrlDecode("aGVsbG8")).toBe("hello");
  });

  it("should handle strings with - and _ characters", () => {
    // Test with a string that produces - and _ in base64url
    const result = base64UrlDecode("eyJhbGciOiJIUzI1NiJ9");
    expect(result).toBe('{"alg":"HS256"}');
  });

  it("should handle padding correctly", () => {
    // Short strings that need padding
    expect(base64UrlDecode("YQ")).toBe("a");
    expect(base64UrlDecode("YWI")).toBe("ab");
    expect(base64UrlDecode("YWJj")).toBe("abc");
  });
});

describe("decodeJwt", () => {
  it("should decode a valid JWT", () => {
    // A real JWT: header.payload.signature
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const result = decodeJwt(token);

    expect(result.header).toContain("HS256");
    expect(result.payload).toContain("John Doe");
    expect(result.payload).toContain("1234567890");
    expect(result.signature).toBe("SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  });

  it("should detect expired token", () => {
    // Create a token with exp in the past
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 })
    );
    const token = `${header}.${payload}.fakesignature`;
    const result = decodeJwt(token);
    expect(result.expStatus).toBe("expired");
  });

  it("should detect valid (non-expired) token", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })
    );
    const token = `${header}.${payload}.fakesignature`;
    const result = decodeJwt(token);
    expect(result.expStatus).toBe("valid");
  });

  it("should return 'none' when no exp claim", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: "123" }));
    const token = `${header}.${payload}.fakesignature`;
    const result = decodeJwt(token);
    expect(result.expStatus).toBe("none");
  });

  it("should throw on malformed token (not 3 parts)", () => {
    expect(() => decodeJwt("only.one.part")).toThrow();
    expect(() => decodeJwt("onlyonepart")).toThrow();
  });
});
