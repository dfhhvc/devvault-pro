"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolWrapper } from "@/components/tool-wrapper";
import { diffText, diffStats } from "@/lib/diff";

/** Maximum input size: 2MB per side */
const MAX_INPUT_SIZE = 2 * 1024 * 1024;

/**
 * Text Diff Checker
 * Compares two texts line-by-line using LCS algorithm.
 * Shows additions (+), deletions (-), and unchanged lines.
 */
export function DiffCheckerTool() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [showUnchanged, setShowUnchanged] = useState(true);
  const [sizeWarning, setSizeWarning] = useState(false);

  useEffect(() => {
    setSizeWarning(oldText.length > MAX_INPUT_SIZE || newText.length > MAX_INPUT_SIZE);
  }, [oldText, newText]);

  const { lines, stats } = useMemo(() => {
    if (!oldText && !newText) return { lines: [], stats: { additions: 0, deletions: 0, unchanged: 0 } };
    const allLines = diffText(oldText, newText);
    const filtered = showUnchanged ? allLines : allLines.filter((l) => l.type !== "unchanged");
    return {
      lines: filtered,
      stats: diffStats(oldText, newText),
    };
  }, [oldText, newText, showUnchanged]);

  const handleClear = useCallback(() => {
    setOldText("");
    setNewText("");
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClear]);

  return (
    <ToolWrapper
      title={"\u6587\u672c Diff \u5bf9\u6bd4"}
      description={"\u9010\u884c\u5bf9\u6bd4\u4e24\u6bb5\u6587\u672c\u5dee\u5f02"}
      onClear={handleClear}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"\u539f\u59cb\u6587\u672c"}</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={"\u7c98\u8d34\u539f\u59cb\u6587\u672c..."}
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{"\u4fee\u6539\u540e\u6587\u672c"}</label>
            <Textarea
              className="flex-1 font-mono text-sm resize-none"
              placeholder={"\u7c98\u8d34\u4fee\u6539\u540e\u7684\u6587\u672c..."}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />
          </div>
        </div>

        {sizeWarning && (
          <p className="text-xs text-destructive">{"\u8f93\u5165\u8d85\u8fc7 2MB\uff0c\u53ef\u80fd\u5bfc\u81f4\u6d4f\u89c8\u5668\u5361\u987f"}</p>
        )}

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showUnchanged}
              onChange={(e) => setShowUnchanged(e.target.checked)}
              className="rounded"
            />
            {"\u663e\u793a\u672a\u53d8\u884c"}
          </label>
          <Badge variant="secondary">
            {"+"}{stats.additions}{" / -"}{stats.deletions}
          </Badge>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-auto rounded-md border border-border bg-card p-3">
          {lines.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {"\u5dee\u5f02\u5c06\u663e\u793a\u5728\u8fd9\u91cc..."}
            </p>
          ) : (
            lines.map((line, i) => {
              const bg =
                line.type === "added"
                  ? "bg-green-500/10"
                  : line.type === "removed"
                  ? "bg-red-500/10"
                  : "";
              const prefix = line.type === "added" ? "+" : line.type === "removed" ? "-" : " ";
              const color =
                line.type === "added"
                  ? "text-green-400"
                  : line.type === "removed"
                  ? "text-red-400"
                  : "text-muted-foreground";
              return (
                <div key={i} className={`font-mono text-xs px-2 py-0.5 rounded ${bg} ${color} whitespace-pre-wrap break-all`}>
                  {prefix} {line.content || " "}
                </div>
              );
            })
          )}
        </div>
      </div>
    </ToolWrapper>
  );
}
