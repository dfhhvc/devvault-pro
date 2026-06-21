/**
 * Text diff utility tests.
 * Imports ACTUAL source code from src/lib/diff.ts.
 */

import { describe, it, expect } from "vitest";
import { diffText, formatUnifiedDiff, diffStats } from "@/lib/diff";

describe("diffText", () => {
  it("should return all unchanged for identical text", () => {
    const result = diffText("hello\nworld", "hello\nworld");
    expect(result).toHaveLength(2);
    expect(result.every((l) => l.type === "unchanged")).toBe(true);
  });

  it("should detect added lines", () => {
    const result = diffText("a\nb", "a\nb\nc");
    const added = result.filter((l) => l.type === "added");
    expect(added).toHaveLength(1);
    expect(added[0].content).toBe("c");
  });

  it("should detect removed lines", () => {
    const result = diffText("a\nb\nc", "a\nb");
    const removed = result.filter((l) => l.type === "removed");
    expect(removed).toHaveLength(1);
    expect(removed[0].content).toBe("c");
  });

  it("should detect modified lines", () => {
    const result = diffText("hello world", "hello earth");
    const removed = result.filter((l) => l.type === "removed");
    const added = result.filter((l) => l.type === "added");
    expect(removed).toHaveLength(1);
    expect(removed[0].content).toBe("hello world");
    expect(added).toHaveLength(1);
    expect(added[0].content).toBe("hello earth");
  });

  it("should handle empty old text", () => {
    const result = diffText("", "new line");
    expect(result.some((l) => l.type === "added")).toBe(true);
  });

  it("should handle empty new text", () => {
    const result = diffText("old line", "");
    expect(result.some((l) => l.type === "removed")).toBe(true);
  });

  it("should handle both empty", () => {
    const result = diffText("", "");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("unchanged");
  });

  it("should preserve line numbers", () => {
    const result = diffText("a\nb\nc", "a\nx\nc");
    const unchanged = result.filter((l) => l.type === "unchanged");
    // First and last lines should be unchanged
    expect(unchanged.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle multi-line complex diff", () => {
    const old = "function hello() {\n  return 'hi';\n}";
    const newT = "function hello() {\n  return 'world';\n  // new comment\n}";
    const result = diffText(old, newT);
    const added = result.filter((l) => l.type === "added");
    const removed = result.filter((l) => l.type === "removed");
    expect(added.length).toBeGreaterThanOrEqual(1);
    expect(removed.length).toBeGreaterThanOrEqual(1);
  });
});

describe("formatUnifiedDiff", () => {
  it("should format with + and - prefixes", () => {
    const result = formatUnifiedDiff("a\nb", "a\nc");
    expect(result).toContain("- b");
    expect(result).toContain("+ c");
    expect(result).toContain("  a"); // unchanged has space prefix
  });

  it("should format all unchanged", () => {
    const result = formatUnifiedDiff("hello", "hello");
    expect(result).toBe("  hello");
  });
});

describe("diffStats", () => {
  it("should count additions, deletions, and unchanged", () => {
    const stats = diffStats("a\nb\nc", "a\nx\nc");
    expect(stats.additions).toBe(1);
    expect(stats.deletions).toBe(1);
    expect(stats.unchanged).toBe(2);
  });

  it("should handle no changes", () => {
    const stats = diffStats("hello", "hello");
    expect(stats.additions).toBe(0);
    expect(stats.deletions).toBe(0);
    expect(stats.unchanged).toBe(1);
  });
});
