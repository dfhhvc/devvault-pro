"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";
import { jsonToTypeScript } from "@/lib/typescript-gen";

/** Maximum input size: 2MB */
const MAX_INPUT_SIZE = 2 * 1024 * 1024;

/**
 * JSON to TypeScript Generator
 * A differentiating feature: auto-generates TypeScript interfaces from JSON.
 * Not found in it-tools or CyberChef.
 */
export function JsonToTsTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [useInterface, setUseInterface] = useState(true);
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
        const result = jsonToTypeScript(input, { useInterface, rootName: "Root" });
        setOutput(result);
      } catch (e) {
        toast.error(`\u751f\u6210\u5931\u8d25: ${e instanceof Error ? e.message : String(e)}`);
        setOutput("");
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [input, useInterface]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        process();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [process]);

  return (
    <ToolWrapper
      title="JSON \u2192 TypeScript"
      description={"\u4ece JSON \u81ea\u52a8\u751f\u6210 TypeScript \u63a5\u53e3\u5b9a\u4e49"}
      outputValue={output}
      onClear={() => {
        setInput("");
        setOutput("");
      }}
      isProcessing={isProcessing}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useInterface}
              onChange={(e) => setUseInterface(e.target.checked)}
              className="rounded"
            />
            {"\u4f7f\u7528 interface\uff08\u5426\u5219\u7528 type\uff09"}
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"JSON \u8f93\u5165"}</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={'{"name": "Alice", "age": 30, "items": [{"id": 1}]}'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {sizeWarning && (
              <p className="text-xs text-destructive">{"\u8f93\u5165\u8d85\u8fc7 2MB"}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"TypeScript \u8f93\u51fa"}</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              readOnly
              value={output}
              placeholder={"// TypeScript \u4ee3\u7801\u5c06\u663e\u793a\u5728\u8fd9\u91cc..."}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={process} disabled={isProcessing || sizeWarning}>
            {isProcessing ? "\u751f\u6210\u4e2d..." : "\u751f\u6210"}
          </Button>
        </div>
      </div>
    </ToolWrapper>
  );
}
