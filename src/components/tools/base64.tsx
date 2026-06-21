"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";
import { base64Encode, base64Decode } from "@/lib/encoding";

/** Maximum input size: 5MB to prevent browser freezing */
const MAX_INPUT_SIZE = 5 * 1024 * 1024;

/**
 * Base64 Encode/Decode Tool
 * Handles UTF-8 text correctly.
 * All processing happens locally in the browser.
 */
export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setSizeWarning(input.length > MAX_INPUT_SIZE);
  }, [input]);

  const process = useCallback(() => {
    if (!input) {
      setOutput("");
      return;
    }
    if (input.length > MAX_INPUT_SIZE) return;
    setIsProcessing(true);
    setTimeout(() => {
      try {
        if (mode === "encode") {
          setOutput(base64Encode(input));
        } else {
          setOutput(base64Decode(input));
        }
      } catch (e) {
        toast.error(`\u5904\u7406\u5931\u8d25: ${e instanceof Error ? e.message : String(e)}`);
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
      title="Base64 \u7f16\u7801/\u89e3\u7801"
      description="Base64 \u7f16\u7801\u4e0e\u89e3\u7801"
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
            <TabsTrigger value="encode">{"\u7f16\u7801"}</TabsTrigger>
            <TabsTrigger value="decode">{"\u89e3\u7801"}</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"\u8f93\u5165"}</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={mode === "encode" ? "\u8f93\u5165\u6587\u672c..." : "\u8f93\u5165 Base64..."}
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
