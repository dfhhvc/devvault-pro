"use client";

import { useMemo, useEffect } from "react";
import {
  Braces,
  Code2,
  KeyRound,
  Search,
  Fingerprint,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toolCategories } from "@/lib/tools";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Braces,
  Code2,
  KeyRound,
  Search,
  Fingerprint,
  Clock,
};

export type SidebarProps = {
  activeTool: string;
  onSelectTool: (toolId: string) => void;
};

export function Sidebar({ activeTool, onSelectTool }: SidebarProps) {
  const [collapsed, setCollapsed] = useLocalStorage("sidebar-collapsed", false);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", []);

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(toolId)) set.delete(toolId);
      else set.add(toolId);
      return Array.from(set);
    });
  };

  const favTools = useMemo(() => {
    const list: { toolId: string; label: string; catId: string }[] = [];
    for (const cat of toolCategories) {
      for (const t of cat.tools) {
        if (favorites.includes(t.id)) {
          list.push({ toolId: t.id, label: t.label, catId: cat.id });
        }
      }
    }
    return list;
  }, [favorites]);

  // Keyboard shortcut: Ctrl+K to toggle sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && e.ctrlKey) {
        e.preventDefault();
        setCollapsed((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCollapsed]);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center justify-between px-3 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm tracking-tight">DevVault</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-2">
          {!collapsed && favTools.length > 0 && (
            <div className="px-3 mb-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                常用
              </div>
              {favTools.map((f) => (
                <button
                  key={f.toolId}
                  onClick={() => onSelectTool(f.toolId)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                    activeTool === f.toolId
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}

          {toolCategories.map((cat) => {
            const Icon = iconMap[cat.icon] || Braces;
            return (
              <div key={cat.id} className="mb-1">
                {!collapsed && (
                  <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </div>
                )}
                {cat.tools.map((tool) => {
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onSelectTool(tool.id)}
                      className={cn(
                        "group relative flex items-center w-full transition-colors",
                        collapsed ? "justify-center px-0 py-2" : "px-3 py-1.5 text-sm",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80"
                      )}
                      title={collapsed ? tool.label : undefined}
                    >
                      {collapsed ? (
                        <span className="text-xs font-medium">{tool.label.slice(0, 2)}</span>
                      ) : (
                        <span className="truncate">{tool.label}</span>
                      )}
                      {!collapsed && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className={cn(
                            "ml-auto opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
                            favorites.includes(tool.id) && "opacity-100 text-yellow-400"
                          )}
                          title="收藏"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {!collapsed && (
        <div className="px-3 py-2 border-t border-sidebar-border">
          <button
            onClick={() => {}}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
          >
            <Keyboard className="h-3.5 w-3.5" />
            快捷键 (Ctrl+/)
          </button>
        </div>
      )}
    </aside>
  );
}
