/**
 * JSON utility tests
 */

import { describe, it, expect } from "vitest";

/**
 * JSON formatter
 */
function formatJson(input: string): string {
  const obj = JSON.parse(input);
  return JSON.stringify(obj, null, 2);
}

function minifyJson(input: string): string {
  const obj = JSON.parse(input);
  return JSON.stringify(obj);
}

/**
 * JSON validator with line/column info
 */
function validateJson(input: string): {
  valid: boolean;
  message: string;
  line?: number;
  column?: number;
} {
  try {
    JSON.parse(input);
    return { valid: true, message: "JSON 格式正确" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const lineMatch = msg.match(/line\s+(\d+)/i);
    const colMatch = msg.match(/column\s+(\d+)/i);
    return {
      valid: false,
      message: msg,
      line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
      column: colMatch ? parseInt(colMatch[1], 10) : undefined,
    };
  }
}

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
    const input = '[1,2,3]';
    expect(formatJson(input)).toContain('[\n  1,\n  2,\n  3\n]');
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
