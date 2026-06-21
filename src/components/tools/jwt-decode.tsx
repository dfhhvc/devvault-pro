"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";
import { decodeJwt } from "@/lib/jwt";

/**
 * JWT Decode Tool
 * Decodes JWT tokens and validates expiration locally.
 *
 * IMPORTANT SECURITY NOTE:
 * - This tool DECODES the JWT (reads its content)
 * - It checks if the token is EXPIRED by comparing timestamps
 * - It does NOT VERIFY the SIGNATURE (cryptographic validation)
 *   because signature verification requires the secret key,
 *   which only the issuing server possesses.
 */
export function JwtDecodeTool() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [expStatus, setExpStatus] = useState<"valid" | "expired" | "none">("none");
  const [isProcessing, setIsProcessing] = useState(false);

  const decode = useCallback(() => {
    if (!input.trim()) {
      setHeader("");
      setPayload("");
      setSignature("");
      setExpStatus("none");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const result = decodeJwt(input);
        setHeader(result.header);
        setPayload(result.payload);
        setSignature(result.signature);
        setExpStatus(result.expStatus);
      } catch (e) {
        toast.error(`\u89e3\u7801\u5931\u8d25: ${e instanceof Error ? e.message : String(e)}`);
        setHeader("");
        setPayload("");
        setSignature("");
        setExpStatus("none");
      } finally {
        setIsProcessing(false);
      }
    }, 0);
  }, [input]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault();
        decode();
      }
      if (e.key === "D" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        setInput("");
        setHeader("");
        setPayload("");
        setSignature("");
        setExpStatus("none");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [decode]);

  return (
    <ToolWrapper
      title="JWT \u89e3\u7801"
      description="JWT \u89e3\u7801\uff08\u4e0d\u9a8c\u8bc1\u7b7e\u540d\uff09"
      onClear={() => {
        setInput("");
        setHeader("");
        setPayload("");
        setSignature("");
        setExpStatus("none");
      }}
      isProcessing={isProcessing}
    >
      <div className="flex flex-col gap-4 h-full">
        <div className="p-3 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">
          <strong>{"\u5b89\u5168\u63d0\u793a\uff1a"}</strong>{"\u6b64\u5de5\u5177\u4ec5\u89e3\u7801 JWT \u5185\u5bb9\u5e76\u68c0\u67e5\u8fc7\u671f\u65f6\u95f4\u3002\u7b7e\u540d\u9a8c\u8bc1\u9700\u8981\u53d1\u884c\u65b9\u7684\u5bc6\u94a5\uff0c\u672c\u5de5\u5177\u4e0d\u8fdb\u884c\u52a0\u5bc6\u9a8c\u8bc1\u3002"}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">JWT Token</label>
          <Textarea
            className="font-mono text-sm resize-none"
            rows={3}
            placeholder="eyJhbGciOiJIUzI1NiIs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={decode}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {"\u89e3\u7801"}
            </button>
            {expStatus !== "none" && (
              <Badge variant={expStatus === "valid" ? "default" : "destructive"}>
                {expStatus === "valid" ? "\u672a\u8fc7\u671f" : "\u5df2\u8fc7\u671f"}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Header</label>
            <Textarea className="flex-1 font-mono text-sm resize-none" readOnly value={header} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Payload</label>
            <Textarea className="flex-1 font-mono text-sm resize-none" readOnly value={payload} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Signature{"\uff08\u4ec5\u663e\u793a\uff0c\u672a\u9a8c\u8bc1\uff09"}</label>
          <Textarea className="font-mono text-sm resize-none" rows={2} readOnly value={signature} />
        </div>
      </div>
    </ToolWrapper>
  );
}
