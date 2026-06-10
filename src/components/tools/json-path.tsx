"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";
import { JSONPath } from "jsonpath-plus";

/**
 * JSONPath Query Tool
 * Queries JSON data using JSONPath expressions.
 * All processing happens locally in the browser.
 */
export function JsonPathTool() {
  const [input, setInput] = useState("");
  const [path, setPath] = useState("$..*");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const query = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const obj = JSON.parse(input);
        const result = JSONPath({ path, json: obj });
        setOutput(JSON.stringify(result, null, 2));
      } catch (e) {
        toast.error(`查询失败: ${e instanceof Error ? e.message : String(e)}`);
        setOutput("");
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [input, path]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        query();
      }
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setInput("");
        setOutput("");
        setPath("$..*");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [query]);

  return (
    <ToolWrapper
      title="JSONPath 查询"
      description="使用 JSONPath 查询 JSON"
      outputValue={output}
      onClear={() => {
        setInput("");
        setOutput("");
        setPath("$..*");
      }}
      isProcessing={isProcessing}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-medium">JSON 输入</label>
          <Textarea
            className="flex-1 font-mono text-sm resize-none"
            placeholder="在此粘贴 JSON..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium whitespace-nowrap">JSONPath</label>
          <Input
            className="font-mono text-sm"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="$..name"
          />
          <Button onClick={query} disabled={isProcessing}>
            {isProcessing ? "查询中..." : "查询"}
          </Button>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-medium">结果</label>
          <Textarea
            className="flex-1 font-mono text-sm resize-none"
            readOnly
            value={output}
          />
        </div>
      </div>
    </ToolWrapper>
  );
}
