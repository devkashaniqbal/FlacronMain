function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(bytes: number): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, bytes * 2);
}

/** Generates a new plaintext API key. Shown to the customer exactly once. */
export function generateApiKey(env: "live" | "test" = "live"): string {
  return `fk_${env}_${randomToken(24)}`;
}

/** One-way hash of an API key for storage/lookup — the plaintext key is never stored. */
export async function hashApiKey(key: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return toHex(digest);
}

export function maskApiKey(key: string): string {
  return `${key.slice(0, 11)}${"•".repeat(10)}${key.slice(-4)}`;
}
