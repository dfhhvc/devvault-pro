"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const shortcuts = [
  { key: "Ctrl + K", action: "切换侧边栏" },
  { key: "Ctrl + D", action: "清空当前输入" },
  { key: "Ctrl + C", action: "复制输出结果（选中时）" },
  { key: "Ctrl + Enter", action: "执行处理/转换" },
  { key: "Ctrl + Shift + L", action: "切换深色/浅色模式" },
  { key: "Ctrl + /", action: "显示快捷键帮助" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && e.ctrlKey) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>键盘快捷键</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2 rounded-md bg-muted"
            >
              <kbd className="px-2 py-0.5 rounded bg-card border border-border font-mono text-xs">
                {s.key}
              </kbd>
              <span className="text-sm text-muted-foreground">{s.action}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
