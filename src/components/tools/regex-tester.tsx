"use client";

import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";

/**
 * Common regex patterns for quick reference.
 */
const regexExamples = [
  { name: "邮箱", pattern: "^[\\w.-]+@[\\w.-]+\\.\\w+$", flags: "" },
  { name: "手机号(中国)", pattern: "^1[3-9]\\d{9}$", flags: "" },
  { name: "URL", pattern: "^https?://[^\\s/$.?#].[^\\s]*$", flags: "i" },
  { name: "IPv4", pattern: "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$", flags: "" },
  { name: "日期(YYYY-MM-DD)", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$", flags: "" },
  { name: "中文字符", pattern: "[\\u4e00-\\u9fa5]", flags: "g" },
  { name: "数字", pattern: "^\\d+$", flags: "" },
  { name: "身份证号", pattern: "^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|X|x)$", flags: "" },
];

/**
 * Regex Tester Tool
 * Real-time regex matching with highlight and capture groups.
 * All processing happens locally in the browser.
 *
 * FIXED: Highlight now correctly handles patterns with capture groups
 * by escaping the pattern before wrapping it for highlighting.
 */
export function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  // Validate regex and set error message
  useEffect(() => {
    if (!pattern) {
      setError("");
      return;
    }
    const timer = setTimeout(() => {
      try {
        new RegExp(pattern, flags);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [pattern, flags]);

  const { matches, groups } = useMemo(() => {
    if (!pattern || !text) return { matches: [] as string[], groups: [] as string[][] };
    try {
      const re = new RegExp(pattern, flags);
      const allMatches: string[] = [];
      const allGroups: string[][] = [];
      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        const localRe = new RegExp(pattern, flags);
        while ((m = localRe.exec(text)) !== null) {
          allMatches.push(m[0]);
          allGroups.push(Array.from(m));
          if (m[0] === "") {
            localRe.lastIndex++;
          }
        }
      } else {
        const m = re.exec(text);
        if (m) {
          allMatches.push(m[0]);
          allGroups.push(Array.from(m));
        }
      }
      return { matches: allMatches, groups: allGroups };
    } catch {
      return { matches: [] as string[], groups: [] as string[][] };
    }
  }, [pattern, flags, text]);

  /**
   * FIXED: Build highlighted text by finding match positions directly,
   * instead of using a new RegExp that would conflict with capture groups.
   */
  const highlightedSegments = useMemo(() => {
    if (!pattern || !text || error) return [{ text, isMatch: false }];

    try {
      const segments: { text: string; isMatch: boolean }[] = [];
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      let lastIndex = 0;
      let m: RegExpExecArray | null;

      while ((m = re.exec(text)) !== null) {
        // Add non-matching text before this match
        if (m.index > lastIndex) {
          segments.push({ text: text.slice(lastIndex, m.index), isMatch: false });
        }
        // Add the match
        segments.push({ text: m[0], isMatch: true });
        lastIndex = m.index + m[0].length;

        // Prevent infinite loop on zero-width matches
        if (m[0] === "") {
          re.lastIndex++;
        }
      }

      // Add remaining non-matching text
      if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), isMatch: false });
      }

      return segments;
    } catch {
      return [{ text, isMatch: false }];
    }
  }, [pattern, flags, text, error]);

  // Keyboard shortcut: Ctrl+D to clear
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "d" && e.ctrlKey) {
        e.preventDefault();
        setPattern("");
        setFlags("g");
        setText("");
        setError("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ToolWrapper
      title="正则测试器"
      description="实时正则匹配测试"
      onClear={() => {
        setPattern("");
        setFlags("g");
        setText("");
        setError("");
      }}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              className="font-mono text-sm flex-1"
              placeholder="正则表达式"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
            <Input
              className="font-mono text-sm w-24"
              placeholder="flags"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
            />
          </div>
          {error && <div className="text-xs text-destructive">{error}</div>}
          <div className="flex flex-wrap gap-2">
            {regexExamples.map((ex) => (
              <button
                key={ex.name}
                onClick={() => {
                  setPattern(ex.pattern);
                  setFlags(ex.flags);
                  toast.info(`已加载: ${ex.name}`);
                }}
                className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 transition-colors"
              >
                {ex.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-medium">测试文本</label>
          <Textarea
            className="flex-1 font-mono text-sm resize-none"
            placeholder="在此输入测试文本..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-0">
          <label className="text-sm font-medium">高亮结果</label>
          <div className="flex-1 font-mono text-sm p-3 rounded-md border border-border bg-card overflow-auto whitespace-pre-wrap">
            {text ? (
              highlightedSegments.map((seg, i) =>
                seg.isMatch ? (
                  <mark key={i} className="bg-primary/30 text-primary-foreground rounded px-0.5">
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )
            ) : (
              <span className="text-muted-foreground">结果将显示在这里...</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">匹配数: {matches.length}</Badge>
          </div>
          {groups.length > 0 && (
            <div className="font-mono text-xs space-y-1">
              {groups.slice(0, 20).map((g, idx) => (
                <div key={idx} className="p-2 rounded-md bg-card border border-border">
                  <span className="text-muted-foreground">#{idx + 1}:</span>{" "}
                  {g.map((item, i) => (
                    <span key={i} className="mr-2">
                      [{i}]: {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  );
}
