"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToolWrapper } from "@/components/tool-wrapper";
import { validateJson } from "@/lib/json";

/** Maximum input size: 5MB to prevent browser freezing */
const MAX_INPUT_SIZE = 5 * 1024 * 1024;

/**
 * JSON Validate Tool
 * Validates JSON syntax and reports exact line/column of errors.
 * All processing happens locally in the browser.
 */
export function JsonValidateTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof validateJson> | null>(null);
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setSizeWarning(input.length > MAX_INPUT_SIZE);
  }, [input]);

  const validate = useCallback(() => {
    if (!input.trim()) {
      setResult(null);
      return;
    }
    if (input.length > MAX_INPUT_SIZE) return;
    setResult(validateJson(input));
  }, [input]);

  // Auto-validate on input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim() && input.length <= MAX_INPUT_SIZE) {
        validate();
      } else {
        setResult(null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [input, validate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
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
      title="JSON \u9a8c\u8bc1"
      description={"\u9a8c\u8bc1 JSON \u8bed\u6cd5\u5e76\u5b9a\u4f4d\u9519\u8bef"}
      onClear={() => {
        setInput("");
        setResult(null);
      }}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-medium">{"\u8f93\u5165 JSON"}</label>
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

        <div className="flex items-center gap-3">
          <button
            onClick={validate}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            disabled={sizeWarning}
          >
            {"\u9a8c\u8bc1"}
          </button>
          {result && (
            <Badge variant={result.valid ? "default" : "destructive"}>
              {result.valid ? "\u6709\u6548" : "\u65e0\u6548"}
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
                {"\u884c: "}{result.line}
                {result.column !== undefined ? `, \u5217: ${result.column}` : ""}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  );
}
