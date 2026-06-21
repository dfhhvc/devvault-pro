"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";
import { formatJson, minifyJson, escapeJson, unescapeJson } from "@/lib/json";

/** Maximum input size: 5MB to prevent browser freezing */
const MAX_INPUT_SIZE = 5 * 1024 * 1024;

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
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setSizeWarning(input.length > MAX_INPUT_SIZE);
  }, [input]);

  const process = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (input.length > MAX_INPUT_SIZE) return;
    setIsProcessing(true);
    setTimeout(() => {
      try {
        let result = "";
        if (mode === "format") {
          result = formatJson(input);
        } else if (mode === "minify") {
          result = minifyJson(input);
        } else if (mode === "escape") {
          result = escapeJson(input);
        } else if (mode === "unescape") {
          result = unescapeJson(input);
        }
        setOutput(result);
      } catch (e) {
        toast.error(`\u5904\u7406\u5931\u8d25: ${e instanceof Error ? e.message : String(e)}`);
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
      title="JSON \u683c\u5f0f\u5316"
      description={"\u683c\u5f0f\u5316\u3001\u538b\u7f29\u3001\u8f6c\u4e49\u3001\u53bb\u8f6c\u4e49 JSON"}
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
            <TabsTrigger value="format">{"\u683c\u5f0f\u5316"}</TabsTrigger>
            <TabsTrigger value="minify">{"\u538b\u7f29"}</TabsTrigger>
            <TabsTrigger value="escape">{"\u8f6c\u4e49"}</TabsTrigger>
            <TabsTrigger value="unescape">{"\u53bb\u8f6c\u4e49"}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"\u8f93\u5165"}</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={"\u5728\u6b64\u7c98\u8d34 JSON..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {sizeWarning && (
              <p className="text-xs text-destructive">{"\u8f93\u5165\u8d85\u8fc7 5MB\uff0c\u53ef\u80fd\u5bfc\u81f4\u6d4f\u89c8\u5668\u5361\u987f"}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"\u8f93\u51fa"}</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              readOnly
              value={output}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={process} disabled={isProcessing || sizeWarning}>
            {isProcessing ? "\u5904\u7406\u4e2d..." : "\u5904\u7406"}
          </Button>
        </div>
      </div>
    </ToolWrapper>
  );
}
