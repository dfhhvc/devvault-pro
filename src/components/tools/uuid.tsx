"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v1, v4 } from "uuid";
import { nanoid } from "nanoid";
import { ulid } from "ulid";

/**
 * UUID / NanoID / ULID Generator Tool
 * Generates unique identifiers locally in the browser.
 * Uses the uuid, nanoid, and ulid libraries.
 */
export function UuidTool() {
  const [tab, setTab] = useState<"uuid" | "nanoid" | "ulid">("uuid");
  const [uuidVersion, setUuidVersion] = useState<"v1" | "v4">("v4");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [nanoLength, setNanoLength] = useState(21);

  const generate = useCallback(() => {
    const out: string[] = [];
    if (tab === "uuid") {
      for (let i = 0; i < count; i++) {
        out.push(uuidVersion === "v1" ? v1() : v4());
      }
    } else if (tab === "nanoid") {
      for (let i = 0; i < count; i++) {
        out.push(nanoid(nanoLength));
      }
    } else {
      for (let i = 0; i < count; i++) {
        out.push(ulid());
      }
    }
    setResults(out);
  }, [tab, uuidVersion, count, nanoLength]);

  // Keyboard shortcut: Ctrl+Enter to generate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        generate();
      }
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setResults([]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  return (
    <ToolWrapper
      title="UUID / NanoID / ULID"
      description="生成唯一标识符"
      onClear={() => setResults([])}
    >
      <div className="flex flex-col gap-4">
        <Tabs value={tab} onValueChange={(v) => { setResults([]); setTab(v as typeof tab); }}>
          <TabsList>
            <TabsTrigger value="uuid">UUID</TabsTrigger>
            <TabsTrigger value="nanoid">NanoID</TabsTrigger>
            <TabsTrigger value="ulid">ULID</TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "uuid" && (
          <div className="flex items-center gap-4">
            <Tabs value={uuidVersion} onValueChange={(v) => setUuidVersion(v as typeof uuidVersion)}>
              <TabsList>
                <TabsTrigger value="v1">UUID v1</TabsTrigger>
                <TabsTrigger value="v4">UUID v4</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {tab === "nanoid" && (
          <div className="flex items-center gap-2">
            <Label className="text-sm">长度</Label>
            <Input
              type="number"
              min={1}
              max={128}
              className="w-24"
              value={nanoLength}
              onChange={(e) => setNanoLength(parseInt(e.target.value) || 21)}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Label className="text-sm">数量</Label>
          <Input
            type="number"
            min={1}
            max={100}
            className="w-24"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          />
          <Button onClick={generate}>生成</Button>
        </div>

        <div className="flex flex-col gap-2">
          {results.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
              <span className="font-mono text-sm break-all mr-2">{r}</span>
              <CopyButton text={r} />
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
}
