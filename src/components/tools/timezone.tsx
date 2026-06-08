"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ToolWrapper } from "@/components/tool-wrapper";

/**
 * Timezone definitions for the converter.
 */
const timezones = [
  { label: "UTC", zone: "UTC" },
  { label: "北京/上海", zone: "Asia/Shanghai" },
  { label: "东京", zone: "Asia/Tokyo" },
  { label: "悉尼", zone: "Australia/Sydney" },
  { label: "伦敦", zone: "Europe/London" },
  { label: "巴黎", zone: "Europe/Paris" },
  { label: "纽约", zone: "America/New_York" },
  { label: "洛杉矶", zone: "America/Los_Angeles" },
  { label: "迪拜", zone: "Asia/Dubai" },
  { label: "新加坡", zone: "Asia/Singapore" },
];

/**
 * Timezone Converter Tool
 * Displays the same moment in time across multiple timezones.
 * All processing happens locally in the browser using Intl.DateTimeFormat.
 */
export function TimezoneTool() {
  const [dateInput, setDateInput] = useState("");

  // Initialize with current time on client side only
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const isoLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setDateInput(isoLocal);
  }, []);

  const formatInZone = (dateStr: string, zone: string) => {
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return "-";
      return new Intl.DateTimeFormat("zh-CN", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(d);
    } catch {
      return "-";
    }
  };

  return (
    <ToolWrapper
      title="时区转换"
      description="多时区时间显示"
      onClear={() => {
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        setDateInput(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">选择时间</label>
          <Input
            type="datetime-local"
            className="font-mono text-sm"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {timezones.map((tz) => (
            <div key={tz.zone} className="p-3 rounded-md bg-card border border-border">
              <div className="text-xs text-muted-foreground mb-1">{tz.label}</div>
              <div className="font-mono text-sm">{formatInZone(dateInput, tz.zone)}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
}
