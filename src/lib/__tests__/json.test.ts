/**
 * JSON utility tests.
 * Imports the ACTUAL source code from src/lib/json.ts.
 * These tests verify the real implementation, not a copy.
 */

import { describe, it, expect } from "vitest";
import { formatJson, minifyJson, escapeJson, unescapeJson, validateJson } from "@/lib/json";

describe("JSON Formatting", () => {
  it("should format compact JSON", () => {
    const input = '{"name":"test","value":123}';
    const formatted = formatJson(input);
    expect(formatted).toContain("{\n");
    expect(formatted).toContain('  "name": "test"');
  });

  it("should minify formatted JSON", () => {
    const input = '{\n  "name": "test"\n}';
    expect(minifyJson(input)).toBe('{"name":"test"}');
  });

  it("should handle nested objects", () => {
    const input = '{"user":{"name":"John","age":30}}';
    const formatted = formatJson(input);
    expect(formatted).toContain('    "name": "John"');
  });

  it("should handle arrays", () => {
    const input = "[1,2,3]";
    expect(formatJson(input)).toContain("[\n  1,\n  2,\n  3\n]");
  });
});

describe("JSON Escape/Unescape", () => {
  it("should escape special characters", () => {
    expect(escapeJson('hello "world"')).toBe('hello \\"world\\"');
  });

  it("should unescape special characters", () => {
    expect(unescapeJson('hello \\"world\\"')).toBe('hello "world"');
  });

  it("should round-trip escape/unescape", () => {
    const original = 'Line1\nLine2\t"quoted"';
    expect(unescapeJson(escapeJson(original))).toBe(original);
  });
});

describe("JSON Validation", () => {
  it("should validate correct JSON", () => {
    const result = validateJson('{"valid": true}');
    expect(result.valid).toBe(true);
  });

  it("should detect missing quotes", () => {
    const result = validateJson('{name: "test"}');
    expect(result.valid).toBe(false);
  });

  it("should detect trailing comma", () => {
    const result = validateJson('{"a": 1,}');
    expect(result.valid).toBe(false);
  });

  it("should report line number for multi-line errors", () => {
    const input = '{\n  "a": 1\n  "b": 2\n}';
    const result = validateJson(input);
    expect(result.valid).toBe(false);
    expect(result.line).toBeDefined();
  });

  it("should handle empty string", () => {
    const result = validateJson("");
    expect(result.valid).toBe(false);
  });
});
