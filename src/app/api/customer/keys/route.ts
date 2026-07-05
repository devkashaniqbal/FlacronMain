import { NextRequest, NextResponse } from "next/server";
import { getActiveSessionCustomerId } from "@/lib/customer-auth";
import { generateApiKey, hashApiKey, maskApiKey } from "@/lib/api-keys";
import { createApiKey, listApiKeys } from "@/lib/customers-data";

export async function GET() {
  const customerId = await getActiveSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated or payment not active" }, { status: 401 });

  const keys = await listApiKeys(customerId);
  return NextResponse.json({
    keys: keys.map((k) => ({
      id: k.id,
      label: k.label,
      maskedKey: k.maskedKey,
      createdAt: k.createdAt,
      revoked: k.revoked,
      lastUsedAt: k.lastUsedAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const customerId = await getActiveSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated or payment not active" }, { status: 401 });

  const { label, env } = await request.json();
  const plaintext = generateApiKey(env === "test" ? "test" : "live");
  const hash = await hashApiKey(plaintext);
  const masked = maskApiKey(plaintext);

  const id = await createApiKey(customerId, hash, label || "Untitled key", masked);

  return NextResponse.json({ id, key: plaintext, maskedKey: masked });
}
