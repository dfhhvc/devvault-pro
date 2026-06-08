"use client";

import { useCallback } from "react";
import { Copy, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type ToolWrapperProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  outputValue?: string;
  onClear?: () => void;
  className?: string;
  isProcessing?: boolean;
};

export function ToolWrapper({
  title,
  description,
  children,
  outputValue,
  onClear,
  className,
  isProcessing = false,
}: ToolWrapperProps) {
  const handleCopy = useCallback(async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  }, []);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
          {outputValue !== undefined && (
            <Button variant="ghost" size="sm" onClick={() => handleCopy(outputValue)}>
              <Copy className="h-4 w-4 mr-1" />
              复制结果
            </Button>
          )}
          {onClear && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Trash2 className="h-4 w-4 mr-1" />
              清空
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  );
}

export function CopyButton({ text, label = "复制" }: { text: string; label?: string }) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败");
    }
  }, [text]);

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="h-4 w-4 mr-1" />
      {label}
    </Button>
  );
}
