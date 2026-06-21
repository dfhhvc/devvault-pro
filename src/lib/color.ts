/**
 * Color format conversion utilities.
 * Supports HEX, RGB, HSL, and OKLCH color spaces.
 *
 * Pure functions, no side effects, fully testable.
 */

export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };
export type OKLCH = { l: number; c: number; h: number };

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

/** Clamp a value to [0, max] */
function clamp(v: number, max: number): number {
  return Math.max(0, Math.min(max, v));
}

/** Parse a hex color string (#RGB, #RRGGBB, #RRGGBBAA) to RGB. */
export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length === 4) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length !== 6 && h.length !== 8) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return { r, g, b };
}

/** Convert RGB to hex string (#RRGGBB). */
export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => clamp(Math.round(v), 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Convert RGB to HSL. */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  let h = 0;
  if (max === rn) {
    h = ((gn - bn) / delta) % 6;
  } else if (max === gn) {
    h = (bn - rn) / delta + 2;
  } else {
    h = (rn - gn) / delta + 4;
  }
  h = h * 60;
  if (h < 0) h += 360;
  const s = delta / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Convert HSL to RGB. */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const hn = h / 360;
  const sn = s / 100;
  const ln = l / 100;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}

/**
 * Linear sRGB to OKLab conversion.
 * Uses the CSS Color 4 spec algorithm.
 */
function linearSrgbToOklab(r: number, g: number, b: number): { L: number; a: number; b: number } {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

/** Convert sRGB (0-255) to linear sRGB (0-1). */
function srgbToLinear(v: number): number {
  const vn = v / 255;
  return vn <= 0.04045 ? vn / 12.92 : Math.pow((vn + 0.055) / 1.055, 2.4);
}

/** Convert RGB to OKLCH. */
export function rgbToOklch({ r, g, b }: RGB): OKLCH {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const lab = linearSrgbToOklab(lr, lg, lb);
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let H = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return {
    l: Math.round(lab.L * 1000) / 10,
    c: Math.round(C * 1000) / 10,
    h: Math.round(H * 10) / 10,
  };
}

/** Convert OKLCH to RGB (approximate, via OKLab). */
export function oklchToRgb({ l, c, h }: OKLCH): RGB {
  const L = l / 100;
  const C = c;
  const H = (h * Math.PI) / 180;
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  // OKLab to linear sRGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const lv = l_ * l_ * l_;
  const mv = m_ * m_ * m_;
  const sv = s_ * s_ * s_;

  const r = 4.0767416621 * lv - 3.3077115913 * mv + 0.2309699292 * sv;
  const g = -1.2684380046 * lv + 2.6097574011 * mv - 0.3413193965 * sv;
  const bl = -0.0041960863 * lv - 0.7034186147 * mv + 1.707614701 * sv;

  // Linear sRGB to sRGB
  const linearToSrgb = (v: number): number => {
    const clamped = clamp(v, 1);
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  return {
    r: Math.round(linearToSrgb(r) * 255),
    g: Math.round(linearToSrgb(g) * 255),
    b: Math.round(linearToSrgb(bl) * 255),
  };
}

/** Parse a CSS rgb() string to RGB. */
export function parseRgb(str: string): RGB {
  const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!m) throw new Error(`Invalid RGB: ${str}`);
  return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
}

/** Parse a CSS hsl() string to HSL. */
export function parseHsl(str: string): HSL {
  const m = str.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/i);
  if (!m) throw new Error(`Invalid HSL: ${str}`);
  return { h: parseInt(m[1]), s: parseInt(m[2]), l: parseInt(m[3]) };
}

/** Parse a CSS oklch() string to OKLCH. */
export function parseOklch(str: string): OKLCH {
  const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/i);
  if (!m) throw new Error(`Invalid OKLCH: ${str}`);
  return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
}

/** Format RGB as a CSS string. */
export function formatRgb({ r, g, b }: RGB): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

/** Format HSL as a CSS string. */
export function formatHsl({ h, s, l }: HSL): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/** Format OKLCH as a CSS string. */
export function formatOklch({ l, c, h }: OKLCH): string {
  return `oklch(${l} ${c} ${h})`;
}

/** Detect the color format from a string. */
export function detectFormat(str: string): ColorFormat | null {
  const s = str.trim().toLowerCase();
  if (s.startsWith("#")) return "hex";
  if (s.startsWith("rgb")) return "rgb";
  if (s.startsWith("hsl")) return "hsl";
  if (s.startsWith("oklch")) return "oklch";
  return null;
}

/** Convert any supported color string to all formats. */
export function convertColor(input: string): {
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
} {
  const format = detectFormat(input);
  if (!format) throw new Error(`Unsupported color format: ${input}`);

  let rgb: RGB;
  switch (format) {
    case "hex":
      rgb = hexToRgb(input);
      break;
    case "rgb":
      rgb = parseRgb(input);
      break;
    case "hsl":
      rgb = hslToRgb(parseHsl(input));
      break;
    case "oklch":
      rgb = oklchToRgb(parseOklch(input));
      break;
  }

  return {
    hex: rgbToHex(rgb),
    rgb: formatRgb(rgb),
    hsl: formatHsl(rgbToHsl(rgb)),
    oklch: formatOklch(rgbToOklch(rgb)),
  };
}
