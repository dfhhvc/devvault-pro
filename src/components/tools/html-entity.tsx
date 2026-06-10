"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";

/**
 * Encodes special HTML characters to their entity equivalents.
 * Prevents XSS by escaping <, >, ", ', and &.
 */
function encodeHtmlEntities(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * FIXED: Decodes HTML entities using a pure JavaScript approach
 * instead of innerHTML, eliminating any XSS risk.
 *
 * Maps common named entities and numeric entities to characters.
 */
function decodeHtmlEntities(str: string): string {
  const namedEntities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: "\u00A0",
    copy: "\u00A9",
    reg: "\u00AE",
    trade: "\u2122",
    hellip: "\u2026",
    mdash: "\u2014",
    ndash: "\u2013",
    ldquo: "\u201C",
    rdquo: "\u201D",
    lsquo: "\u2018",
    rsquo: "\u2019",
  };

  return str.replace(
    /&(?:#(x?[\da-fA-F]+)|([a-zA-Z][a-zA-Z0-9]*));/g,
    (_, numeric, named) => {
      if (named) {
        return namedEntities[named] || `&${named};`;
      }
      if (numeric) {
        if (numeric.startsWith("x") || numeric.startsWith("X")) {
          return String.fromCodePoint(parseInt(numeric.slice(1), 16));
        }
        return String.fromCodePoint(parseInt(numeric, 10));
      }
      return _;
    }
  );
}

/**
 * HTML Entity Encode/Decode Tool
 * All processing happens locally in the browser.
 */
export function HtmlEntityTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [isProcessing, setIsProcessing] = useState(false);

  const process = useCallback(() => {
    if (!input) {
      setOutput("");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      try {
        if (mode === "encode") {
          setOutput(encodeHtmlEntities(input));
        } else {
          setOutput(decodeHtmlEntities(input));
        }
      } catch (e) {
        toast.error(`处理失败: ${e instanceof Error ? e.message : String(e)}`);
        setOutput("");
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [input, mode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        process();
      }
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setInput("");
        setOutput("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [process]);

  return (
    <ToolWrapper
      title="HTML 实体编码/解码"
      description="HTML 实体编码与解码"
      outputValue={output}
      onClear={() => {
        setInput("");
        setOutput("");
      }}
      isProcessing={isProcessing}
    >
      <div className="flex flex-col gap-4 h-full">
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList>
            <TabsTrigger value="encode">编码</TabsTrigger>
            <TabsTrigger value="decode">解码</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">输入</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={mode === "encode" ? "输入 HTML..." : "输入实体编码..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">输出</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              readOnly
              value={output}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={process} disabled={isProcessing}>
            {isProcessing ? "处理中..." : "处理"}
          </Button>
        </div>
      </div>
    </ToolWrapper>
  );
}
