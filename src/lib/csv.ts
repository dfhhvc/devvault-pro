/**
 * CSV conversion utility functions.
 * All functions are pure and side-effect free, making them testable.
 */

/**
 * Converts an array of objects to CSV string.
 * Handles commas, quotes, and newlines in values.
 * @throws Error if input is not a non-empty array.
 */
export function jsonToCsv(json: unknown): string {
  if (!Array.isArray(json) || json.length === 0) {
    throw new Error("JSON \u5fc5\u987b\u662f\u5bf9\u8c61\u6570\u7ec4");
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
 * Parses a CSV string into an array of objects.
 * Handles quoted values and escaped quotes.
 */
export function csvToJson(csv: string): unknown[] {
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
