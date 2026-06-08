"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { Sidebar } from "@/components/sidebar";
import { ToolRenderer } from "@/components/tool-renderer";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { findTool } from "@/lib/tools";
import { ShieldCheck, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

/**
 * Main application page.
 * Provides the layout with sidebar navigation, header, and tool rendering area.
 * Includes keyboard shortcuts and theme switching.
 */
export default function Home() {
  const [activeTool, setActiveTool] = useState("json-format");
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const tool = findTool(activeTool);

  // Keyboard shortcut: Ctrl+Shift+L to toggle theme
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "L" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [theme, setTheme]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="hidden md:flex">
        <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex h-14 items-center justify-between px-4 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger className="md:hidden" render={
                <Button variant="ghost" size="icon" aria-label="菜单">
                  <Menu className="h-5 w-5" />
                </Button>
              } />
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar activeTool={activeTool} onSelectTool={setActiveTool} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">DevVault</span>
            </div>
            {tool && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                / {tool.label}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
              <ShieldCheck className="h-3 w-3" />
              100% 本地运行
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="切换主题"
            >
              {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <ToolRenderer toolId={activeTool} />
        </main>
      </div>

      <KeyboardShortcuts />
    </div>
  );
}
