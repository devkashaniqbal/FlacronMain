import { getCustomerById } from "@/lib/customers-data";

export const CUSTOMER_COOKIE = "flacron_customer_token";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SECRET || "fallback-secret-change-me";
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

async function hmac(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(sig);
}

// ---- Password hashing (PBKDF2) ----

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `${toHex(salt.buffer as ArrayBuffer)}:${toHex(bits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = fromHex(saltHex);
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt.buffer as ArrayBuffer, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return toHex(bits) === hashHex;
}

// ---- Session tokens (customerId.expiry.signature) ----

export type CustomerSession = { customerId: string };

export async function createSessionToken(customerId: string): Promise<string> {
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${customerId}.${expiry}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function getSessionCustomerId(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  const session = await verifySessionToken(store.get(CUSTOMER_COOKIE)?.value);
  return session?.customerId ?? null;
}

/**
 * Like getSessionCustomerId, but also enforces the payment gate. Use this in
 * every /api/customer/* route that manages dashboard data (keys, usage,
 * profile) — middleware only guards pages, not API routes, so this is the
 * actual security boundary preventing a pending (unpaid) account from using
 * dashboard functionality directly via the API.
 */
export async function getActiveSessionCustomerId(): Promise<string | null> {
  const customerId = await getSessionCustomerId();
  if (!customerId) return null;
  const customer = await getCustomerById(customerId);
  if (!customer || customer.billingStatus !== "active") return null;
  return customerId;
}

export async function verifySessionToken(token: string | undefined): Promise<CustomerSession | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [customerId, expiryStr, sig] = parts;
  const expiry = Number(expiryStr);
  if (!customerId || !expiry || Number.isNaN(expiry)) return null;
  if (Date.now() > expiry) return null;
  const expectedSig = await hmac(`${customerId}.${expiryStr}`);
  if (sig !== expectedSig) return null;
  return { customerId };
}
