"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";

/**
 * Converts an array of objects to CSV string.
 * Handles commas, quotes, and newlines in values.
 */
function jsonToCsv(json: unknown): string {
  if (!Array.isArray(json) || json.length === 0) {
    throw new Error("JSON 必须是对象数组");
  }
  const keys = Array.from(new Set(json.flatMap((row) => (row && typeof row === "object" ? Object.keys(row) : []))));
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [keys.join(",")];
  for (const row of json) {
    if (row && typeof row === "object") {
      lines.push(keys.map((k) => escape((row as Record<string, unknown>)[k])).join(","));
    }
  }
  return lines.join("\n");
}

/**
 * Parses a CSV string into an array of objects.
 * Handles quoted values and escaped quotes.
 */
function csvToJson(csv: string): unknown[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length === 0) return [];
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  };
  const headers = parseLine(lines[0]);
  const out: Record<string, unknown>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    out.push(row);
  }
  return out;
}

/**
 * JSON ↔ CSV Converter Tool
 */
export function JsonCsvTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [isProcessing, setIsProcessing] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
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
      title="JSON ↔ CSV"
      description="JSON 与 CSV 互转"
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
            <TabsTrigger value="json-to-csv">JSON → CSV</TabsTrigger>
            <TabsTrigger value="csv-to-json">CSV → JSON</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {direction === "json-to-csv" ? "JSON 输入" : "CSV 输入"}
            </label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={
                direction === "json-to-csv"
                  ? "[{\"name\":\"A\",\"age\":1}]"
                  : "name,age\nA,1"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {direction === "json-to-csv" ? "CSV 输出" : "JSON 输出"}
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
