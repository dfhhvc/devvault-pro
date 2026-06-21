"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper";
import { generatePassword } from "@/lib/crypto";

/**
 * Password Generator Tool
 * Generates strong passwords using crypto.getRandomValues for cryptographically secure randomness.
 * Uses rejection sampling to eliminate modulo bias.
 */
export function PasswordTool() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    const out: string[] = [];
    for (let p = 0; p < 5; p++) {
      out.push(
        generatePassword(length, {
          includeUpper,
          includeLower,
          includeNumbers,
          includeSymbols,
        })
      );
    }
    setPasswords(out);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  // Keyboard shortcut: Ctrl+Enter to generate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        generate();
      }
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setPasswords([]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  return (
    <ToolWrapper
      title={"\u5bc6\u7801\u751f\u6210\u5668"}
      description={"\u751f\u6210\u5bc6\u7801\u5b66\u5b89\u5168\u7684\u5f3a\u5bc6\u7801"}
      onClear={() => setPasswords([])}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">{"\u957f\u5ea6"}</Label>
          <Input
            type="number"
            min={4}
            max={128}
            className="w-24"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value) || 16)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
            <Label className="text-sm">{"\u5927\u5199\u5b57\u6bcd"}</Label>
            <Switch checked={includeUpper} onCheckedChange={setIncludeUpper} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
            <Label className="text-sm">{"\u5c0f\u5199\u5b57\u6bcd"}</Label>
            <Switch checked={includeLower} onCheckedChange={setIncludeLower} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
            <Label className="text-sm">{"\u6570\u5b57"}</Label>
            <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
            <Label className="text-sm">{"\u7279\u6b8a\u7b26\u53f7"}</Label>
            <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={generate}>{"\u751f\u6210"}</Button>
        </div>

        <div className="flex flex-col gap-2">
          {passwords.map((pwd, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
              <span className="font-mono text-sm break-all mr-2">{pwd}</span>
              <CopyButton text={pwd} />
            </div>
          ))}
        </div>
      </div>
    </ToolWrapper>
  );
}
