import { NextRequest, NextResponse } from "next/server";
import { getSessionCustomerId } from "@/lib/customer-auth";
import { getCustomerById } from "@/lib/customers-data";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Billing is not configured yet" }, { status: 500 });
  }

  const customer = await getCustomerById(customerId);
  if (!customer?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account yet — subscribe to a plan first" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripeCustomerId,
    return_url: `${request.nextUrl.origin}/dashboard/billing`,
  });

  return NextResponse.json({ url: session.url });
}
