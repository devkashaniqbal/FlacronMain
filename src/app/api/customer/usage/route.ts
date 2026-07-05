import { NextResponse } from "next/server";
import { getActiveSessionCustomerId } from "@/lib/customer-auth";
import { getRecentUsage, getUsageBreakdown, getCustomerById, getQuotaStatus } from "@/lib/customers-data";

export async function GET() {
  const customerId = await getActiveSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated or payment not active" }, { status: 401 });

  const customer = await getCustomerById(customerId);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [recent, breakdown, quota] = await Promise.all([
    getRecentUsage(customerId, 50),
    getUsageBreakdown(customerId),
    getQuotaStatus(customerId, customer.plan),
  ]);

  return NextResponse.json({ recent, breakdown, quota });
}
