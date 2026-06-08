"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";

/**
 * JSON Format Tool
 * Supports format, minify, escape, and unescape operations.
 * All processing happens locally in the browser.
 */
export function JsonFormatTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"format" | "minify" | "escape" | "unescape">("format");
  const [isProcessing, setIsProcessing] = useState(false);

  const process = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setIsProcessing(true);
    // Use setTimeout to allow UI to show loading state for large inputs
    setTimeout(() => {
      try {
        let result = "";
        if (mode === "format") {
          const obj = JSON.parse(input);
          result = JSON.stringify(obj, null, 2);
        } else if (mode === "minify") {
          const obj = JSON.parse(input);
          result = JSON.stringify(obj);
        } else if (mode === "escape") {
          result = JSON.stringify(input).slice(1, -1);
        } else if (mode === "unescape") {
          result = JSON.parse('"' + input.replace(/"/g, '\\"') + '"');
        }
        setOutput(result);
      } catch (e) {
        toast.error(`处理失败: ${e instanceof Error ? e.message : String(e)}`);
        setOutput("");
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [input, mode]);

  // Keyboard shortcut: Ctrl+Enter to process
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
      title="JSON 格式化"
      description="格式化、压缩、转义、去转义 JSON"
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
            <TabsTrigger value="format">格式化</TabsTrigger>
            <TabsTrigger value="minify">压缩</TabsTrigger>
            <TabsTrigger value="escape">转义</TabsTrigger>
            <TabsTrigger value="unescape">去转义</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">输入</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder="在此粘贴 JSON..."
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
