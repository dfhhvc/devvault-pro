/**
 * Color conversion utility tests.
 * Imports ACTUAL source code from src/lib/color.ts.
 */

import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  convertColor,
  detectFormat,
} from "@/lib/color";

describe("HEX to RGB", () => {
  it("should convert 6-digit hex", () => {
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("should convert 3-digit hex", () => {
    expect(hexToRgb("#f00")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("should convert without #", () => {
    expect(hexToRgb("00ff00")).toEqual({ r: 0, g: 255, b: 0 });
  });

  it("should throw on invalid hex", () => {
    expect(() => hexToRgb("#xyz")).toThrow();
    expect(() => hexToRgb("#12")).toThrow();
  });
});

describe("RGB to HEX", () => {
  it("should convert to hex string", () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe("#ff0000");
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe("#00ff00");
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe("#0000ff");
  });

  it("should handle rounding", () => {
    expect(rgbToHex({ r: 127.6, g: 200.3, b: 50.9 })).toBe("#80c833");
  });
});

describe("RGB to HSL", () => {
  it("should convert red", () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it("should convert green", () => {
    const hsl = rgbToHsl({ r: 0, g: 255, b: 0 });
    expect(hsl.h).toBe(120);
    expect(hsl.s).toBe(100);
    expect(hsl.l).toBe(50);
  });

  it("should handle grayscale", () => {
    const hsl = rgbToHsl({ r: 128, g: 128, b: 128 });
    expect(hsl.h).toBe(0);
    expect(hsl.s).toBe(0);
  });
});

describe("HSL to RGB", () => {
  it("should convert back correctly", () => {
    const original = { r: 100, g: 150, b: 200 };
    const hsl = rgbToHsl(original);
    const rgb = hslToRgb(hsl);
    // Allow for rounding errors (±2)
    expect(Math.abs(rgb.r - original.r)).toBeLessThanOrEqual(2);
    expect(Math.abs(rgb.g - original.g)).toBeLessThanOrEqual(2);
    expect(Math.abs(rgb.b - original.b)).toBeLessThanOrEqual(2);
  });

  it("should convert pure colors", () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 });
  });
});

describe("RGB to OKLCH and back", () => {
  it("should convert to OKLCH", () => {
    const oklch = rgbToOklch({ r: 255, g: 0, b: 0 });
    expect(oklch.l).toBeGreaterThan(0);
    expect(oklch.l).toBeLessThan(100);
    expect(oklch.c).toBeGreaterThan(0);
    expect(oklch.h).toBeGreaterThanOrEqual(0);
    expect(oklch.h).toBeLessThan(360);
  });

  it("should round-trip approximately", () => {
    const original = { r: 100, g: 200, b: 50 };
    const oklch = rgbToOklch(original);
    const back = oklchToRgb(oklch);
    // OKLCH round-trip has some error due to gamut
    expect(Math.abs(back.r - original.r)).toBeLessThanOrEqual(10);
    expect(Math.abs(back.g - original.g)).toBeLessThanOrEqual(10);
    expect(Math.abs(back.b - original.b)).toBeLessThanOrEqual(10);
  });
});

describe("convertColor (multi-format)", () => {
  it("should convert hex to all formats", () => {
    const result = convertColor("#ff0000");
    expect(result.hex).toBe("#ff0000");
    expect(result.rgb).toContain("255");
    expect(result.rgb).toContain("0");
    expect(result.hsl).toContain("0");
    expect(result.hsl).toContain("100%");
    expect(result.oklch).toMatch(/oklch\(/);
  });

  it("should convert rgb input", () => {
    const result = convertColor("rgb(0, 255, 0)");
    expect(result.hex).toBe("#00ff00");
  });

  it("should convert hsl input", () => {
    const result = convertColor("hsl(240, 100%, 50%)");
    expect(result.hex).toBe("#0000ff");
  });

  it("should convert oklch input", () => {
    const result = convertColor("oklch(70 0.15 30)");
    expect(result.hex).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe("detectFormat", () => {
  it("should detect hex", () => {
    expect(detectFormat("#ff0000")).toBe("hex");
  });

  it("should detect rgb", () => {
    expect(detectFormat("rgb(255, 0, 0)")).toBe("rgb");
  });

  it("should detect hsl", () => {
    expect(detectFormat("hsl(0, 100%, 50%)")).toBe("hsl");
  });

  it("should detect oklch", () => {
    expect(detectFormat("oklch(70 0.15 30)")).toBe("oklch");
  });

  it("should return null for unknown format", () => {
    expect(detectFormat("not a color")).toBeNull();
  });
});
