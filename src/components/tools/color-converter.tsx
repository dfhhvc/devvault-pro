"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper";
import { convertColor, detectFormat } from "@/lib/color";

interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
}

/**
 * Color Converter Tool
 * Converts between HEX, RGB, HSL, and OKLCH color formats.
 * Includes a live preview swatch.
 */
export function ColorConverterTool() {
  const [input, setInput] = useState("#3b82f6");
  const [results, setResults] = useState<ColorResult | null>(null);
  const [error, setError] = useState("");

  const convert = useCallback(() => {
    if (!input.trim()) {
      setResults(null);
      setError("");
      return;
    }
    try {
      const r = convertColor(input);
      setResults(r);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setResults(null);
    }
  }, [input]);

  // Auto-convert on input change
  useEffect(() => {
    const timer = setTimeout(convert, 200);
    return () => clearTimeout(timer);
  }, [convert]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setInput("");
        setResults(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const format = detectFormat(input);
  const swatchColor = results?.hex || input;

  const formats: { label: string; value: string; key: keyof ColorResult }[] = [
    { label: "HEX", value: results?.hex || "", key: "hex" },
    { label: "RGB", value: results?.rgb || "", key: "rgb" },
    { label: "HSL", value: results?.hsl || "", key: "hsl" },
    { label: "OKLCH", value: results?.oklch || "", key: "oklch" },
  ];

  return (
    <ToolWrapper
      title={"\u989c\u8272\u8f6c\u6362\u5668"}
      description="HEX / RGB / HSL / OKLCH \u4e92\u8f6c"
      onClear={() => {
        setInput("");
        setResults(null);
      }}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{"\u8f93\u5165\u989c\u8272"}</label>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border border-border flex-shrink-0"
              style={{ backgroundColor: swatchColor }}
            />
            <Input
              className="font-mono text-sm flex-1"
              placeholder="#3b82f6, rgb(59,130,246), hsl(217,91%,60%), oklch(62 0.19 259)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          {format && (
            <p className="text-xs text-muted-foreground">{"\u68c0\u6d4b\u5230\u683c\u5f0f: "}{format.toUpperCase()}</p>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="flex flex-col gap-2">
          {formats.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between p-3 rounded-md bg-card border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground uppercase w-12">{label}</span>
                <span className="font-mono text-sm break-all">{value || "—"}</span>
              </div>
              {value && <CopyButton text={value} />}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground p-3 rounded-md bg-secondary">
          {"\u652f\u6301\u683c\u5f0f\uff1a#ff0000, rgb(255,0,0), hsl(0,100%,50%), oklch(63 0.25 29)"}
        </div>
      </div>
    </ToolWrapper>
  );
}
