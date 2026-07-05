import { NextRequest, NextResponse } from "next/server";
import { getSessionCustomerId } from "@/lib/customer-auth";
import { getCustomerById, setCustomerStripeCustomerId } from "@/lib/customers-data";
import { getPlan } from "@/lib/plans";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Billing is not configured yet. Contact sales to activate your plan." }, { status: 500 });
  }

  const customer = await getCustomerById(customerId);
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { planId } = await request.json();
  const plan = getPlan(planId);
  if (!plan.stripePriceId) {
    return NextResponse.json({ error: "This plan requires a custom quote — submit a custom order request instead." }, { status: 400 });
  }

  const stripe = getStripe();

  let stripeCustomerId = customer.stripeCustomerId;
  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: customer.orgName,
      metadata: { flacronCustomerId: customer.id },
    });
    stripeCustomerId = stripeCustomer.id;
    await setCustomerStripeCustomerId(customer.id, stripeCustomerId);
  }

  const origin = request.nextUrl.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
    metadata: { customerId: customer.id, planId: plan.id },
    subscription_data: { metadata: { customerId: customer.id, planId: plan.id } },
  });

  return NextResponse.json({ url: session.url });
}
