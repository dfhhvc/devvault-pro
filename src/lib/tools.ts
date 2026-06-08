/**
 * Tool registry definitions.
 * Central source of truth for all available tools and their categories.
 */

export type ToolCategory = {
  id: string;
  label: string;
  icon: string;
  tools: ToolDef[];
};

export type ToolDef = {
  id: string;
  label: string;
  description: string;
};

export const toolCategories: ToolCategory[] = [
  {
    id: "json",
    label: "JSON 工具",
    icon: "Braces",
    tools: [
      { id: "json-format", label: "JSON 格式化", description: "格式化、压缩、转义、去转义 JSON" },
      { id: "json-validate", label: "JSON 验证", description: "验证 JSON 语法并定位错误" },
      { id: "json-yaml", label: "JSON ↔ YAML", description: "JSON 与 YAML 互转" },
      { id: "json-csv", label: "JSON ↔ CSV", description: "JSON 与 CSV 互转" },
      { id: "json-path", label: "JSONPath 查询", description: "使用 JSONPath 查询 JSON" },
    ],
  },
  {
    id: "encode",
    label: "编码解码",
    icon: "Code2",
    tools: [
      { id: "base64", label: "Base64", description: "Base64 编码/解码" },
      { id: "url-encode", label: "URL 编码", description: "URL 编码/解码" },
      { id: "html-entity", label: "HTML 实体", description: "HTML 实体编码/解码" },
      { id: "hex", label: "Hex 编码", description: "十六进制编码/解码" },
    ],
  },
  {
    id: "jwt",
    label: "JWT 调试",
    icon: "KeyRound",
    tools: [
      { id: "jwt-decode", label: "JWT 解码", description: "解码并验证 JWT Token" },
    ],
  },
  {
    id: "regex",
    label: "正则测试",
    icon: "Search",
    tools: [
      { id: "regex-tester", label: "正则测试器", description: "实时正则匹配测试" },
    ],
  },
  {
    id: "hash",
    label: "哈希与生成",
    icon: "Fingerprint",
    tools: [
      { id: "hash", label: "哈希计算", description: "MD5 / SHA-1 / SHA-256 / SHA-512" },
      { id: "uuid", label: "UUID / NanoID / ULID", description: "生成唯一标识符" },
      { id: "password", label: "密码生成器", description: "生成强密码" },
    ],
  },
  {
    id: "time",
    label: "时间工具",
    icon: "Clock",
    tools: [
      { id: "timestamp", label: "时间戳转换", description: "Unix 时间戳与日期互转" },
      { id: "timezone", label: "时区转换", description: "多时区时间显示" },
    ],
  },
];

export function findTool(toolId: string): ToolDef | undefined {
  for (const cat of toolCategories) {
    const t = cat.tools.find((x) => x.id === toolId);
    if (t) return t;
  }
  return undefined;
}

export function findCategoryByToolId(toolId: string): ToolCategory | undefined {
  return toolCategories.find((cat) => cat.tools.some((t) => t.id === toolId));
}
