import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getCustomerById, getQuotaStatus, getRecentUsage, listApiKeys } from "@/lib/customers-data";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [quota, keys, usage] = await Promise.all([
    getQuotaStatus(customer.id, customer.plan),
    listApiKeys(customer.id),
    getRecentUsage(customer.id, 50),
  ]);

  return NextResponse.json({
    id: customer.id,
    email: customer.email,
    orgName: customer.orgName,
    createdAt: customer.createdAt,
    profile: customer.profile,
    quota,
    keys: keys.map((k) => ({
      id: k.id,
      label: k.label,
      maskedKey: k.maskedKey,
      createdAt: k.createdAt,
      revoked: k.revoked,
      lastUsedAt: k.lastUsedAt,
    })),
    usage,
  });
}
