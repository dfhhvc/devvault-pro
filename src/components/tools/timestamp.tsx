"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToolWrapper } from "@/components/tool-wrapper";

/**
 * Timestamp Converter Tool
 * Converts between Unix timestamps and human-readable dates.
 * All processing happens locally in the browser.
 */
export function TimestampTool() {
  const [timestamp, setTimestamp] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [relativeTime, setRelativeTime] = useState("-");

  // Initialize with current time on client side only
  useEffect(() => {
    const ts = Math.floor(Date.now() / 1000).toString();
    setTimestamp(ts);
    setDateStr(new Date().toISOString());
  }, []);

  const tsToDate = useCallback(() => {
    const ts = parseInt(timestamp, 10);
    if (Number.isNaN(ts)) return;
    const d = new Date(ts.toString().length > 10 ? ts : ts * 1000);
    setDateStr(d.toISOString());
  }, [timestamp]);

  const dateToTs = useCallback(() => {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return;
    setTimestamp(Math.floor(d.getTime() / 1000).toString());
  }, [dateStr]);

  // Update relative time when dateStr changes
  useEffect(() => {
    if (!dateStr) {
      setRelativeTime("-");
      return;
    }
    const d = new Date(dateStr).getTime();
    if (Number.isNaN(d)) {
      setRelativeTime("-");
      return;
    }
    const diff = Date.now() - d;
    const abs = Math.abs(diff);
    const suffix = diff > 0 ? "前" : "后";
    const s = Math.floor(abs / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const days = Math.floor(h / 24);
    if (days > 0) setRelativeTime(`${days}天${suffix}`);
    else if (h > 0) setRelativeTime(`${h}小时${suffix}`);
    else if (m > 0) setRelativeTime(`${m}分钟${suffix}`);
    else setRelativeTime(`${s}秒${suffix}`);
  }, [dateStr]);

  // Keyboard shortcut: Ctrl+D to reset
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        const ts = Math.floor(Date.now() / 1000).toString();
        setTimestamp(ts);
        setDateStr(new Date().toISOString());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ToolWrapper
      title="时间戳转换"
      description="Unix 时间戳与日期互转"
      onClear={() => {
        const ts = Math.floor(Date.now() / 1000).toString();
        setTimestamp(ts);
        setDateStr(new Date().toISOString());
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Unix 时间戳 (秒)</label>
          <div className="flex items-center gap-2">
            <Input
              className="font-mono text-sm"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
            <Button onClick={tsToDate}>→ 日期</Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">日期时间 (ISO 8601)</label>
          <div className="flex items-center gap-2">
            <Input
              className="font-mono text-sm"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
            <Button onClick={dateToTs}>→ 时间戳</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-md bg-card border border-border">
            <div className="text-xs text-muted-foreground mb-1">本地时间</div>
            <div className="font-mono text-sm">
              {dateStr ? new Date(dateStr).toLocaleString() : "-"}
            </div>
          </div>
          <div className="p-3 rounded-md bg-card border border-border">
            <div className="text-xs text-muted-foreground mb-1">UTC 时间</div>
            <div className="font-mono text-sm">
              {dateStr ? new Date(dateStr).toUTCString() : "-"}
            </div>
          </div>
          <div className="p-3 rounded-md bg-card border border-border">
            <div className="text-xs text-muted-foreground mb-1">毫秒时间戳</div>
            <div className="font-mono text-sm">
              {timestamp ? (parseInt(timestamp, 10) * 1000).toString() : "-"}
            </div>
          </div>
          <div className="p-3 rounded-md bg-card border border-border">
            <div className="text-xs text-muted-foreground mb-1">相对时间</div>
            <div className="font-mono text-sm">{relativeTime}</div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  );
}
