import { NextResponse } from "next/server";
import { getSessionCustomerId } from "@/lib/customer-auth";
import { getCustomerById, getQuotaStatus } from "@/lib/customers-data";

export async function GET() {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const customer = await getCustomerById(customerId);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const quota = await getQuotaStatus(customer.id, customer.plan);

  return NextResponse.json({
    id: customer.id,
    email: customer.email,
    orgName: customer.orgName,
    plan: quota.plan,
    billingStatus: customer.billingStatus,
    usage: { used: quota.used, remaining: quota.remaining, overQuota: quota.overQuota },
    profile: customer.profile,
  });
}
