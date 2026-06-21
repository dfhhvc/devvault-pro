/**
 * JSON utility functions.
 * All functions are pure and side-effect free, making them testable.
 */

export type JsonValidationResult = {
  valid: boolean;
  message: string;
  line?: number;
  column?: number;
};

/**
 * Formats (pretty-prints) a JSON string with 2-space indentation.
 */
export function formatJson(input: string): string {
  const obj = JSON.parse(input);
  return JSON.stringify(obj, null, 2);
}

/**
 * Minifies a JSON string (removes all whitespace).
 */
export function minifyJson(input: string): string {
  const obj = JSON.parse(input);
  return JSON.stringify(obj);
}

/**
 * Escapes a string for use inside JSON (adds backslashes before special chars).
 */
export function escapeJson(input: string): string {
  return JSON.stringify(input).slice(1, -1);
}

/**
 * Unescapes a JSON-escaped string back to its original form.
 */
export function unescapeJson(input: string): string {
  return JSON.parse('"' + input.replace(/"/g, '\\"') + '"');
}

/**
 * Validates JSON syntax and reports exact line/column of errors.
 */
export function validateJson(input: string): JsonValidationResult {
  try {
    JSON.parse(input);
    return { valid: true, message: "JSON \u683c\u5f0f\u6b63\u786e" };
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
