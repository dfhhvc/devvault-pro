/**
 * CSV conversion tests
 */

import { describe, it, expect } from "vitest";

/**
 * JSON to CSV converter
 */
function jsonToCsv(json: unknown): string {
  if (!Array.isArray(json) || json.length === 0) {
    throw new Error("JSON 必须是对象数组");
  }
  const keys = Array.from(
    new Set(
      json.flatMap((row) =>
        row && typeof row === "object" ? Object.keys(row) : []
      )
    )
  );
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [keys.join(",")];
  for (const row of json) {
    if (row && typeof row === "object") {
      lines.push(
        keys.map((k) => escape((row as Record<string, unknown>)[k])).join(",")
      );
    }
  }
  return lines.join("\n");
}

/**
 * CSV to JSON converter
 */
function csvToJson(csv: string): unknown[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  };

  const headers = parseLine(lines[0]);
  const out: Record<string, unknown>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    out.push(row);
  }
  return out;
}

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
    expect(() => jsonToCsv("not an array")).toThrow("JSON 必须是对象数组");
  });

  it("should throw on empty array", () => {
    expect(() => jsonToCsv([])).toThrow("JSON 必须是对象数组");
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
