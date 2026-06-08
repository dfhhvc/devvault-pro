"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";

/**
 * Converts UTF-8 text to space-separated hexadecimal representation.
 */
function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

/**
 * Converts space-separated or continuous hexadecimal to UTF-8 text.
 * @throws Error if hex length is not even or contains invalid characters.
 */
function hexToText(hex: string): string {
  const cleaned = hex.replace(/\s+/g, "");
  if (cleaned.length % 2 !== 0) throw new Error("Hex 长度必须为偶数");
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Hex Encode/Decode Tool
 * All processing happens locally in the browser.
 */
export function HexTool() {
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
          setOutput(textToHex(input));
        } else {
          setOutput(hexToText(input));
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
      if (e.key === "d" && e.ctrlKey) {
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
      title="Hex 编码/解码"
      description="十六进制编码与解码"
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
              placeholder={mode === "encode" ? "输入文本..." : "输入 Hex..."}
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
