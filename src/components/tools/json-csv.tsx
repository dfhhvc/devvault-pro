"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";
import { jsonToCsv, csvToJson } from "@/lib/csv";

/** Maximum input size: 5MB to prevent browser freezing */
const MAX_INPUT_SIZE = 5 * 1024 * 1024;

/**
 * JSON <-> CSV Converter Tool
 * All processing happens locally in the browser.
 */
export function JsonCsvTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setSizeWarning(input.length > MAX_INPUT_SIZE);
  }, [input]);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (input.length > MAX_INPUT_SIZE) return;
    setIsProcessing(true);
    setTimeout(() => {
      try {
        if (direction === "json-to-csv") {
          const obj = JSON.parse(input);
          setOutput(jsonToCsv(obj));
        } else {
          const obj = csvToJson(input);
          setOutput(JSON.stringify(obj, null, 2));
        }
      } catch (e) {
        toast.error(`\u8f6c\u6362\u5931\u8d25: ${e instanceof Error ? e.message : String(e)}`);
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
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
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
      title="JSON \u2194 CSV"
      description="JSON \u4e0e CSV \u4e92\u8f6c"
      outputValue={output}
      onClear={() => {
        setInput("");
        setOutput("");
      }}
      isProcessing={isProcessing}
    >
      <div className="flex flex-col gap-4 h-full">
        <Tabs value={direction} onValueChange={(v) => setDirection(v as typeof direction)}>
          <TabsList>
            <TabsTrigger value="json-to-csv">JSON {"\u2192"} CSV</TabsTrigger>
            <TabsTrigger value="csv-to-json">CSV {"\u2192"} JSON</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {direction === "json-to-csv" ? "JSON \u8f93\u5165" : "CSV \u8f93\u5165"}
            </label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={
                direction === "json-to-csv"
                  ? '[{"name":"A","age":1}]'
                  : "name,age\nA,1"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {sizeWarning && (
              <p className="text-xs text-destructive">{"\u8f93\u5165\u8d85\u8fc7 5MB\uff0c\u53ef\u80fd\u5bfc\u81f4\u6d4f\u89c8\u5668\u5361\u987f"}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {direction === "json-to-csv" ? "CSV \u8f93\u51fa" : "JSON \u8f93\u51fa"}
            </label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              readOnly
              value={output}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={convert} disabled={isProcessing || sizeWarning}>
            {isProcessing ? "\u8f6c\u6362\u4e2d..." : "\u8f6c\u6362"}
          </Button>
        </div>
      </div>
    </ToolWrapper>
  );
}
