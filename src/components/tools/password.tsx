"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper";

/**
 * Password Generator Tool
 * Generates strong passwords using crypto.getRandomValues for cryptographically secure randomness.
 *
 * FIXED: Uses rejection sampling to eliminate modulo bias.
 * Instead of simple `random % charset.length`, we discard values
 * that would skew the distribution toward certain characters.
 */
export function PasswordTool() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);

  /**
   * Generate a single unbiased random character from the charset.
   * Uses rejection sampling to avoid modulo bias.
   */
  const getRandomChar = (charset: string): string => {
    const charSetLength = charset.length;
    // Calculate the largest multiple of charset length that fits in a byte
    const maxValid = Math.floor(256 / charSetLength) * charSetLength;

    let randomByte: number;
    do {
      const array = new Uint8Array(1);
      crypto.getRandomValues(array);
      randomByte = array[0];
    } while (randomByte >= maxValid); // Reject values that would cause bias

    return charset[randomByte % charSetLength];
  };

  const generate = useCallback(() => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let chars = "";
    if (includeUpper) chars += upper;
    if (includeLower) chars += lower;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    if (!chars) chars = lower;

    const out: string[] = [];
    for (let p = 0; p < 5; p++) {
      let pwd = "";
      for (let i = 0; i < length; i++) {
        pwd += getRandomChar(chars);
      }
      out.push(pwd);
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
      if (e.key === "d" && e.ctrlKey) {
        e.preventDefault();
        setPasswords([]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  return (
    <ToolWrapper
      title="密码生成器"
      description="生成密码学安全的强密码"
      onClear={() => setPasswords([])}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm">长度</Label>
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
            <Label className="text-sm">大写字母</Label>
            <Switch checked={includeUpper} onCheckedChange={setIncludeUpper} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
            <Label className="text-sm">小写字母</Label>
            <Switch checked={includeLower} onCheckedChange={setIncludeLower} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
            <Label className="text-sm">数字</Label>
            <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-md bg-card border border-border">
            <Label className="text-sm">特殊符号</Label>
            <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={generate}>生成</Button>
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
