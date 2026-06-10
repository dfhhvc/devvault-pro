"use client";

import { useState, useCallback, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToolWrapper } from "@/components/tool-wrapper";
import { toast } from "sonner";

/**
 * Decodes a Base64Url-encoded string to UTF-8 text.
 * Base64Url uses '-' instead of '+' and '_' instead of '/'.
 */
function base64UrlDecode(str: string): string {
  const padding = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/") + padding;
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

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
 *
 * To fully verify a JWT, you need the secret/public key from
 * the token issuer and must perform HMAC/RSA verification.
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
        const parts = input.trim().split(".");
        if (parts.length !== 3) throw new Error("JWT 必须由三部分组成（Header.Payload.Signature）");
        const headerJson = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
        const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
        const payloadJson = JSON.stringify(payloadObj, null, 2);
        setHeader(headerJson);
        setPayload(payloadJson);
        setSignature(parts[2]);

        if (typeof payloadObj.exp === "number") {
          const now = Math.floor(Date.now() / 1000);
          setExpStatus(payloadObj.exp > now ? "valid" : "expired");
        } else {
          setExpStatus("none");
        }
      } catch (e) {
        toast.error(`解码失败: ${e instanceof Error ? e.message : String(e)}`);
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
      title="JWT 解码"
      description="解码 JWT Token（不验证签名）"
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
          <strong>安全提示：</strong>此工具仅解码 JWT 内容并检查过期时间。
          签名验证需要发行方的密钥，本工具不进行加密验证。
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
              解码
            </button>
            {expStatus !== "none" && (
              <Badge variant={expStatus === "valid" ? "default" : "destructive"}>
                {expStatus === "valid" ? "未过期" : "已过期"}
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
          <label className="text-sm font-medium">Signature（仅显示，未验证）</label>
          <Textarea className="font-mono text-sm resize-none" rows={2} readOnly value={signature} />
        </div>
      </div>
    </ToolWrapper>
  );
}
