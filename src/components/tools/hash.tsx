"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolWrapper } from "@/components/tool-wrapper";
import { md5, sha1, sha256, sha512 } from "@/lib/crypto";

/** Maximum input size: 5MB to prevent browser freezing */
const MAX_INPUT_SIZE = 5 * 1024 * 1024;

/**
 * Hash Tool
 * Computes MD5, SHA-1, SHA-256, and SHA-512 hashes locally.
 * All processing happens in the browser using Web Crypto API.
 */
export function HashTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [algo, setAlgo] = useState<"all" | "md5" | "sha1" | "sha256" | "sha512">("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setSizeWarning(input.length > MAX_INPUT_SIZE);
  }, [input]);

  const compute = useCallback(async () => {
    if (!input) {
      setResults({});
      return;
    }
    if (input.length > MAX_INPUT_SIZE) {
      return;
    }
    setIsProcessing(true);
    try {
      const out: Record<string, string> = {};
      if (algo === "all" || algo === "md5") out.md5 = md5(input);
      if (algo === "all" || algo === "sha1") out.sha1 = await sha1(input);
      if (algo === "all" || algo === "sha256") out.sha256 = await sha256(input);
      if (algo === "all" || algo === "sha512") out.sha512 = await sha512(input);
      setResults(out);
    } finally {
      setIsProcessing(false);
    }
  }, [input, algo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        compute();
      }
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setInput("");
        setResults({});
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [compute]);

  return (
    <ToolWrapper
      title={"\u54c8\u5e0c\u8ba1\u7b97"}
      description="MD5 / SHA-1 / SHA-256 / SHA-512"
      onClear={() => {
        setInput("");
        setResults({});
      }}
      isProcessing={isProcessing}
    >
      <div className="flex flex-col gap-4 h-full">
        <Tabs value={algo} onValueChange={(v) => setAlgo(v as typeof algo)}>
          <TabsList>
            <TabsTrigger value="all">{"\u5168\u90e8"}</TabsTrigger>
            <TabsTrigger value="md5">MD5</TabsTrigger>
            <TabsTrigger value="sha1">SHA-1</TabsTrigger>
            <TabsTrigger value="sha256">SHA-256</TabsTrigger>
            <TabsTrigger value="sha512">SHA-512</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-medium">{"\u8f93\u5165"}</label>
          <Textarea
            className="flex-1 font-mono text-sm resize-none"
            placeholder={"\u8f93\u5165\u6587\u672c..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {sizeWarning && (
            <p className="text-xs text-destructive">
              {"\u8f93\u5165\u8d85\u8fc7 5MB\uff0c\u53ef\u80fd\u5bfc\u81f4\u6d4f\u89c8\u5668\u5361\u987f"}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={compute} disabled={isProcessing || sizeWarning}>
            {isProcessing ? "\u8ba1\u7b97\u4e2d..." : "\u8ba1\u7b97"}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="p-3 rounded-md bg-card border border-border">
              <div className="text-xs font-medium text-muted-foreground uppercase mb-1">{key}</div>
              <div className="font-mono text-sm break-all">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
}
