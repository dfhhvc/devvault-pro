/**
 * Tool Renderer
 * Maps tool IDs to their corresponding components.
 * All tool components are imported here for centralized routing.
 */

import { JsonFormatTool } from "@/components/tools/json-format";
import { JsonValidateTool } from "@/components/tools/json-validate";
import { JsonYamlTool } from "@/components/tools/json-yaml";
import { JsonCsvTool } from "@/components/tools/json-csv";
import { JsonPathTool } from "@/components/tools/json-path";
import { Base64Tool } from "@/components/tools/base64";
import { UrlEncodeTool } from "@/components/tools/url-encode";
import { HtmlEntityTool } from "@/components/tools/html-entity";
import { HexTool } from "@/components/tools/hex";
import { JwtDecodeTool } from "@/components/tools/jwt-decode";
import { RegexTesterTool } from "@/components/tools/regex-tester";
import { HashTool } from "@/components/tools/hash";
import { UuidTool } from "@/components/tools/uuid";
import { PasswordTool } from "@/components/tools/password";
import { TimestampTool } from "@/components/tools/timestamp";
import { TimezoneTool } from "@/components/tools/timezone";

const toolMap: Record<string, React.ComponentType> = {
  "json-format": JsonFormatTool,
  "json-validate": JsonValidateTool,
  "json-yaml": JsonYamlTool,
  "json-csv": JsonCsvTool,
  "json-path": JsonPathTool,
  base64: Base64Tool,
  "url-encode": UrlEncodeTool,
  "html-entity": HtmlEntityTool,
  hex: HexTool,
  "jwt-decode": JwtDecodeTool,
  "regex-tester": RegexTesterTool,
  hash: HashTool,
  uuid: UuidTool,
  password: PasswordTool,
  timestamp: TimestampTool,
  timezone: TimezoneTool,
};

export function ToolRenderer({ toolId }: { toolId: string }) {
  const Component = toolMap[toolId];
  if (!Component) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        未知工具
      </div>
    );
  }
  return <Component />;
}
