import { NextRequest, NextResponse } from "next/server";
import { getActiveSessionCustomerId } from "@/lib/customer-auth";
import { getCustomerById, updateCustomerProfile, type CustomerProfile } from "@/lib/customers-data";

export async function PATCH(request: NextRequest) {
  const customerId = await getActiveSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated or payment not active" }, { status: 401 });

  const customer = await getCustomerById(customerId);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const profile: CustomerProfile = {
    region: String(body.region ?? customer.profile.region),
    units: body.units === "metric" ? "metric" : "imperial",
    currency: String(body.currency ?? customer.profile.currency),
    markupPercent: Number(body.markupPercent ?? customer.profile.markupPercent) || 0,
    notes: String(body.notes ?? customer.profile.notes).slice(0, 2000),
  };

  await updateCustomerProfile(customerId, profile);
  return NextResponse.json({ ok: true, profile });
}
