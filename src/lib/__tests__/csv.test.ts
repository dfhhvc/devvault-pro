/**
 * CSV conversion utility tests.
 * Imports the ACTUAL source code from src/lib/csv.ts.
 * These tests verify the real implementation, not a copy.
 */

import { describe, it, expect } from "vitest";
import { jsonToCsv, csvToJson } from "@/lib/csv";

describe("JSON to CSV", () => {
  it("should convert simple objects", () => {
    const json = [
      { name: "Alice", age: 25 },
      { name: "Bob", age: 30 },
    ];
    const csv = jsonToCsv(json);
    expect(csv).toBe("name,age\nAlice,25\nBob,30");
  });

  it("should handle values with commas", () => {
    const json = [{ name: "Doe, John", city: "New York" }];
    const csv = jsonToCsv(json);
    expect(csv).toBe('name,city\n"Doe, John",New York');
  });

  it("should handle values with quotes", () => {
    const json = [{ quote: 'He said "hello"' }];
    const csv = jsonToCsv(json);
    expect(csv).toBe('quote\n"He said ""hello"""');
  });

  it("should handle null values", () => {
    const json = [{ name: "Test", value: null }];
    const csv = jsonToCsv(json);
    expect(csv).toBe("name,value\nTest,");
  });

  it("should throw on non-array input", () => {
    expect(() => jsonToCsv("not an array")).toThrow();
  });

  it("should throw on empty array", () => {
    expect(() => jsonToCsv([])).toThrow();
  });
});

describe("CSV to JSON", () => {
  it("should parse simple CSV", () => {
    const csv = "name,age\nAlice,25\nBob,30";
    const json = csvToJson(csv);
    expect(json).toEqual([
      { name: "Alice", age: "25" },
      { name: "Bob", age: "30" },
    ]);
  });

  it("should handle quoted values with commas", () => {
    const csv = 'name,city\n"Doe, John",New York';
    const json = csvToJson(csv);
    expect(json).toEqual([{ name: "Doe, John", city: "New York" }]);
  });

  it("should handle quoted values with quotes", () => {
    const csv = 'quote\n"He said ""hello"""';
    const json = csvToJson(csv);
    expect(json).toEqual([{ quote: 'He said "hello"' }]);
  });

  it("should handle empty CSV", () => {
    expect(csvToJson("")).toEqual([]);
  });

  it("should handle extra whitespace lines", () => {
    const csv = "a,b\n1,2\n\n\n";
    const json = csvToJson(csv);
    expect(json).toEqual([{ a: "1", b: "2" }]);
  });
});

describe("Round-trip conversion", () => {
  it("should preserve data through round-trip", () => {
    const original = [
      { name: "Test", value: "123", desc: "A, B, C" },
      { name: "Another", value: "456", desc: 'With "quotes"' },
    ];
    const csv = jsonToCsv(original);
    const back = csvToJson(csv);
    expect(back).toEqual(original);
  });
});
