"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";
import yaml from "js-yaml";

/**
 * JSON ↔ YAML Converter Tool
 * Converts between JSON and YAML formats locally in the browser.
 */
export function JsonYamlTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");
  const [isProcessing, setIsProcessing] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      try {
        if (direction === "json-to-yaml") {
          const obj = JSON.parse(input);
          setOutput(yaml.dump(obj));
        } else {
          const obj = yaml.load(input);
          setOutput(JSON.stringify(obj, null, 2));
        }
      } catch (e) {
        toast.error(`转换失败: ${e instanceof Error ? e.message : String(e)}`);
        setOutput("");
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [input, direction]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        convert();
      }
      if (e.key === "d" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
        setOutput("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [convert]);

  return (
    <ToolWrapper
      title="JSON ↔ YAML"
      description="JSON 与 YAML 互转"
      outputValue={output}
      onClear={() => {
        setInput("");
        setOutput("");
      }}
      isProcessing={isProcessing}
    >
      <div className="flex flex-col gap-4 h-full">
        <Tabs
          value={direction}
          onValueChange={(v) => setDirection(v as typeof direction)}
        >
          <TabsList>
            <TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
            <TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {direction === "json-to-yaml" ? "JSON 输入" : "YAML 输入"}
            </label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={
                direction === "json-to-yaml"
                  ? "在此粘贴 JSON..."
                  : "在此粘贴 YAML..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {direction === "json-to-yaml" ? "YAML 输出" : "JSON 输出"}
            </label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              readOnly
              value={output}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={convert} disabled={isProcessing}>
            {isProcessing ? "转换中..." : "转换"}
          </Button>
        </div>
      </div>
    </ToolWrapper>
  );
}
