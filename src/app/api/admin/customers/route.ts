import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listAllCustomers, listApiKeys, getQuotaStatus } from "@/lib/customers-data";

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customers = await listAllCustomers();

  const enriched = await Promise.all(
    customers.map(async (c) => {
      const [quota, keys] = await Promise.all([
        getQuotaStatus(c.id, c.plan),
        listApiKeys(c.id),
      ]);
      return {
        id: c.id,
        email: c.email,
        orgName: c.orgName,
        plan: quota.plan,
        createdAt: c.createdAt,
        usage: { used: quota.used, remaining: quota.remaining, overQuota: quota.overQuota },
        activeKeys: keys.filter((k) => !k.revoked).length,
        totalKeys: keys.length,
      };
    })
  );

  return NextResponse.json({ customers: enriched });
}
