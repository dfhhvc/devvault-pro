/**
 * JSON to TypeScript generator tests.
 * Imports ACTUAL source code from src/lib/typescript-gen.ts.
 */

import { describe, it, expect } from "vitest";
import { jsonToTypeScript } from "@/lib/typescript-gen";

describe("JSON to TypeScript", () => {
  it("should generate interface for simple object", () => {
    const json = '{"name": "Alice", "age": 30}';
    const result = jsonToTypeScript(json);
    expect(result).toContain("interface Root");
    expect(result).toContain("name: string");
    expect(result).toContain("age: number");
  });

  it("should handle nested objects", () => {
    const json = '{"user": {"name": "Bob", "active": true}}';
    const result = jsonToTypeScript(json);
    expect(result).toContain("user:");
    expect(result).toContain("name: string");
    expect(result).toContain("active: boolean");
  });

  it("should handle arrays of objects", () => {
    const json = '[{"id": 1, "name": "A"}, {"id": 2, "name": "B"}]';
    const result = jsonToTypeScript(json, { rootName: "Item" });
    expect(result).toContain("type Item = Item[]");
    expect(result).toContain("interface Item");
    expect(result).toContain("id: number");
    expect(result).toContain("name: string");
  });

  it("should handle arrays of primitives", () => {
    const json = "[1, 2, 3]";
    const result = jsonToTypeScript(json);
    expect(result).toContain("number[]");
  });

  it("should handle null values", () => {
    const json = '{"value": null}';
    const result = jsonToTypeScript(json);
    expect(result).toContain("value: null");
  });

  it("should handle mixed array types", () => {
    const json = '[1, "hello", true]';
    const result = jsonToTypeScript(json);
    expect(result).toContain("(number | string | boolean)[]");
  });

  it("should handle empty object", () => {
    const json = "{}";
    const result = jsonToTypeScript(json);
    expect(result).toContain("type Root = {}");
  });

  it("should handle empty array", () => {
    const json = "[]";
    const result = jsonToTypeScript(json);
    expect(result).toContain("unknown[]");
  });

  it("should use 'type' keyword when useInterface is false", () => {
    const json = '{"a": 1}';
    const result = jsonToTypeScript(json, { useInterface: false });
    expect(result).toContain("type Root =");
    expect(result).not.toContain("interface Root");
  });

  it("should handle deeply nested structures", () => {
    const json = '{"a": {"b": {"c": {"d": 42}}}}';
    const result = jsonToTypeScript(json);
    expect(result).toContain("d: number");
  });

  it("should handle non-ASCII keys", () => {
    const json = '{"名字": "Alice", "年龄": 30}';
    const result = jsonToTypeScript(json);
    expect(result).toContain('"名字": string');
    expect(result).toContain('"年龄": number');
  });

  it("should throw on invalid JSON", () => {
    expect(() => jsonToTypeScript("{invalid}")).toThrow("Invalid JSON");
  });

  it("should handle union types from array elements with different keys", () => {
    const json = '[{"a": 1, "b": 2}, {"b": 3, "c": 4}]';
    const result = jsonToTypeScript(json, { rootName: "Item" });
    // "b" exists in both, "a" and "c" are optional
    expect(result).toContain("b: number");
    // Should handle optional fields
    expect(result).toMatch(/[ac]\??:/);
  });
});
