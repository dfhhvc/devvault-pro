/**
 * JWT utility functions.
 * All functions are pure and side-effect free, making them testable.
 */

export type JwtDecodeResult = {
  header: string;
  payload: string;
  signature: string;
  expStatus: "valid" | "expired" | "none";
};

/**
 * Decodes a Base64Url-encoded string to UTF-8 text.
 * Base64Url uses '-' instead of '+' and '_' instead of '/'.
 */
export function base64UrlDecode(str: string): string {
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
 * Decodes a JWT token and checks expiration.
 *
 * SECURITY NOTE: This function DECODES the JWT (reads its content).
 * It does NOT VERIFY the SIGNATURE (cryptographic validation)
 * because signature verification requires the secret key,
 * which only the issuing server possesses.
 *
 * @throws Error if the token is malformed.
 */
export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error(
      "JWT \u5fc5\u987b\u7531\u4e09\u90e8\u5206\u7ec4\u6210\uff08Header.Payload.Signature\uff09"
    );
  }

  const headerJson = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
  const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
  const payloadJson = JSON.stringify(payloadObj, null, 2);

  let expStatus: "valid" | "expired" | "none" = "none";
  if (typeof payloadObj.exp === "number") {
    const now = Math.floor(Date.now() / 1000);
    expStatus = payloadObj.exp > now ? "valid" : "expired";
  }

  return {
    header: headerJson,
    payload: payloadJson,
    signature: parts[2],
    expStatus,
  };
}
