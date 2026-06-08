"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToolWrapper } from "@/components/tool-wrapper";

/**
 * JSON Validate Tool
 * Validates JSON syntax and reports exact line/column of errors.
 * All processing happens locally in the browser.
 */
export function JsonValidateTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    valid: boolean;
    message: string;
    line?: number;
    column?: number;
  } | null>(null);

  const validate = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    try {
      JSON.parse(input);
      setResult({ valid: true, message: "JSON 格式正确" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const lineMatch = msg.match(/line\s+(\d+)/i);
      const colMatch = msg.match(/column\s+(\d+)/i);
      setResult({
        valid: false,
        message: msg,
        line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
        column: colMatch ? parseInt(colMatch[1], 10) : undefined,
      });
    }
  }, [input]);

  // Auto-validate on input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) validate();
      else setResult(null);
    }, 500);
    return () => clearTimeout(timer);
  }, [input, validate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "d" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
        setResult(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ToolWrapper
      title="JSON 验证"
      description="验证 JSON 语法并定位错误"
      onClear={() => {
        setInput("");
        setResult(null);
      }}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-medium">输入 JSON</label>
          <Textarea
            className="flex-1 font-mono text-sm resize-none"
            placeholder="在此粘贴 JSON..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={validate}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            验证
          </button>
          {result && (
            <Badge variant={result.valid ? "default" : "destructive"}>
              {result.valid ? "有效" : "无效"}
            </Badge>
          )}
        </div>

        {result && (
          <div
            className={`p-3 rounded-md text-sm ${
              result.valid
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            <div className="font-medium">{result.message}</div>
            {result.line !== undefined && (
              <div className="text-xs mt-1 opacity-80">
                行: {result.line}
                {result.column !== undefined ? `, 列: ${result.column}` : ""}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
