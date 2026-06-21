/**
 * JSON to TypeScript interface generator.
 * Converts JSON objects into TypeScript interface definitions.
 *
 * This is a differentiating feature not found in it-tools or CyberChef.
 */

export type TsType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "undefined"
  | { kind: "array"; element: TsType }
  | { kind: "union"; members: TsType[] }
  | { kind: "object"; fields: Record<string, TsType> }
  | { kind: "ref"; name: string };

export interface GenOptions {
  /** Use `interface` instead of `type` for object definitions */
  useInterface?: boolean;
  /** Prefix for generated type names */
  rootName?: string;
  /** Add optional `?` for fields that are undefined in some array elements */
  detectOptional?: boolean;
  /** Export the types */
  exportTypes?: boolean;
}

const defaults: Required<GenOptions> = {
  useInterface: true,
  rootName: "Root",
  exportTypes: true,
  detectOptional: true,
};

/**
 * Infer a TsType from a JavaScript value.
 */
function inferType(value: unknown): TsType {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  const t = typeof value;
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (Array.isArray(value)) {
    if (value.length === 0) return { kind: "array", element: "undefined" as TsType };
    const elementTypes = value.map(inferType);
    return { kind: "array", element: mergeTypes(elementTypes) };
  }
  if (t === "object" && value !== null) {
    const fields: Record<string, TsType> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      fields[k] = inferType(v);
    }
    return { kind: "object", fields };
  }
  return "undefined";
}

/**
 * Merge multiple types into a single type (union if they differ).
 */
function mergeTypes(types: TsType[]): TsType {
  if (types.length === 0) return "undefined";
  if (types.length === 1) return types[0];

  // Group: objects with same keys get merged, others become union
  const objects = types.filter(
    (t): t is Extract<TsType, { kind: "object" }> => typeof t === "object" && t.kind === "object"
  );
  const nonObjects = types.filter((t) => !(typeof t === "object" && t.kind === "object"));

  if (objects.length === types.length) {
    // All objects — merge fields
    const allKeys = new Set<string>();
    objects.forEach((o) => Object.keys(o.fields).forEach((k) => allKeys.add(k)));
    const mergedFields: Record<string, TsType> = {};
    for (const key of allKeys) {
      const fieldTypes = objects
        .map((o) => o.fields[key])
        .filter((t): t is TsType => t !== undefined);
      mergedFields[key] = mergeTypes(fieldTypes);
    }
    return { kind: "object", fields: mergedFields };
  }

  // Mixed — create union, deduplicate
  const seen = new Set<string>();
  const unique: TsType[] = [];
  for (const t of types) {
    const key = typeKey(t);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(t);
    }
  }
  if (unique.length === 1) return unique[0];
  return { kind: "union", members: unique };
}

function typeKey(t: TsType): string {
  if (typeof t === "string") return t;
  return JSON.stringify(t);
}

/**
 * Collect all nested object types and assign names.
 * Returns a map from typeKey -> name.
 */
function collectNamedTypes(
  t: TsType,
  baseName: string,
  named: Map<string, string>,
  usedNames: Set<string>
): void {
  if (typeof t === "string") return;
  if (t.kind === "object") {
    const key = typeKey(t);
    if (!named.has(key)) {
      const name = uniqueName(baseName, usedNames);
      named.set(key, name);
      // Recurse into fields
      for (const [k, v] of Object.entries(t.fields)) {
        collectNamedTypes(v, capitalize(singularize(k)) || baseName, named, usedNames);
      }
    }
  } else if (t.kind === "array") {
    collectNamedTypes(t.element, singularize(baseName) || baseName, named, usedNames);
  } else if (t.kind === "union") {
    t.members.forEach((m) => collectNamedTypes(m, baseName, named, usedNames));
  }
}

function uniqueName(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let i = 2;
  while (used.has(`${base}${i}`)) i++;
  const name = `${base}${i}`;
  used.add(name);
  return name;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function singularize(s: string): string {
  if (s.endsWith("ies")) return s.slice(0, -3) + "y";
  if (s.endsWith("ses")) return s.slice(0, -2);
  if (s.endsWith("s") && !s.endsWith("ss")) return s.slice(0, -1);
  return s;
}

/**
 * Render a TsType to a string (inline form).
 */
function renderTypeInline(t: TsType, named: Map<string, string>): string {
  if (typeof t === "string") {
    if (t === "null") return "null";
    if (t === "undefined") return "undefined";
    return t;
  }
  if (t.kind === "ref") return t.name;
  if (t.kind === "array") {
    const el = renderTypeInline(t.element, named);
    // Wrap unions in parens: (string | number)[]
    if (typeof t.element === "object" && t.element.kind === "union") {
      return `(${el})[]`;
    }
    return `${el}[]`;
  }
  if (t.kind === "union") {
    return t.members.map((m) => renderTypeInline(m, named)).join(" | ");
  }
  if (t.kind === "object") {
    const key = typeKey(t);
    const name = named.get(key);
    if (name) return name;
    // Inline object
    const fields = Object.entries(t.fields)
      .map(([k, v]) => {
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
        return `${safeKey}: ${renderTypeInline(v, named)}`;
      })
      .join("; ");
    return `{ ${fields} }`;
  }
  return "any";
}

/**
 * Render all named object types as TypeScript declarations.
 */
function renderNamedTypes(
  named: Map<string, string>,
  namedTypes: Map<string, TsType>,
  options: Required<GenOptions>
): string {
  const lines: string[] = [];
  for (const [key, name] of named) {
    const type = namedTypes.get(key)!;
    const fields = Object.entries(type.fields);
    const keyword = options.useInterface ? "interface" : "type";
    const prefix = options.exportTypes ? "export " : "";
    const suffix = options.useInterface ? "" : ";";

    lines.push(`${prefix}${keyword} ${name} {`);
    for (const [k, v] of fields) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
      const isUndefined = typeof v === "string" && v === "undefined";
      const optional = isUndefined ? "?" : "";
      const typeStr = isUndefined ? "unknown" : renderTypeInline(v === "undefined" ? "unknown" : v, named);
      lines.push(`  ${safeKey}${optional}: ${typeStr};`);
    }
    lines.push(`}${suffix}`);
    lines.push("");
  }
  return lines.join("\n");
}

/**
 * Generate TypeScript type definitions from a JSON string.
 *
 * @param jsonString - Valid JSON string
 * @param options - Generation options
 * @returns TypeScript code as a string
 * @throws Error if JSON is invalid
 */
export function jsonToTypeScript(jsonString: string, options: GenOptions = {}): string {
  const opts = { ...defaults, ...options };
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }

  const rootType = inferType(parsed);

  // If root is an array, use element type for naming
  const rootIsArray = typeof rootType === "object" && rootType.kind === "array";
  const elementName = opts.rootName;
  const rootName = rootIsArray ? singularize(elementName) || elementName : elementName;

  // Collect named types
  const named = new Map<string, string>();
  const usedNames = new Set<string>();
  const namedTypes = new Map<string, TsType>();

  // First pass: collect all object types
  collectNamedTypes(rootType, rootName, named, usedNames);

  // Build namedTypes lookup
  function fillNamedTypes(t: TsType): void {
    if (typeof t === "string") return;
    if (t.kind === "object") {
      const key = typeKey(t);
      namedTypes.set(key, t);
      Object.values(t.fields).forEach(fillNamedTypes);
    } else if (t.kind === "array") {
      fillNamedTypes(t.element);
    } else if (t.kind === "union") {
      t.members.forEach(fillNamedTypes);
    }
  }
  fillNamedTypes(rootType);

  // Render
  const output: string[] = [];

  // Header comment
  output.push("/**");
  output.push(` * Generated by DevVault Pro — JSON to TypeScript`);
  output.push(` * ${new Date().toISOString()}`);
  output.push(" */");
  output.push("");

  // Named types (interfaces)
  const typesCode = renderNamedTypes(named, namedTypes, opts);
  if (typesCode.trim()) {
    output.push(typesCode);
  }

  // Root type alias
  const rootInline = renderTypeInline(rootType, named);
  const prefix = opts.exportTypes ? "export " : "";
  output.push(`${prefix}type ${opts.rootName} = ${rootInline};`);
  output.push("");

  return output.join("\n");
}
