import { NextRequest, NextResponse } from "next/server";
import { getActiveSessionCustomerId } from "@/lib/customer-auth";
import { revokeApiKey } from "@/lib/customers-data";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const customerId = await getActiveSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated or payment not active" }, { status: 401 });

  const { id } = await params;
  try {
    await revokeApiKey(customerId, id);
  } catch {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
