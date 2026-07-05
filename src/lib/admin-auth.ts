export const ADMIN_COOKIE = "flacron_admin_token";

export async function generateToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET || "fallback-secret-change-me";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode("flacron-admin-v1"));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyToken(token: string): Promise<boolean> {
  const expected = await generateToken();
  return token === expected;
}

/** Checks the admin session cookie on an incoming request. Use in every /api/admin/* route handler. */
export async function isAdminRequest(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE}=([^;]+)`));
  const token = match?.[1];
  if (!token) return false;
  return verifyToken(decodeURIComponent(token));
}
