import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { getCustomerByStripeCustomerId, setCustomerPlan, setCustomerBillingStatus } from "@/lib/customers-data";
import { getPlanByStripePriceId, type PlanId } from "@/lib/plans";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature || "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${(err as Error).message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.metadata?.customerId;
      const planId = session.metadata?.planId;
      if (customerId && planId) {
        await setCustomerPlan(customerId, planId as PlanId, session.subscription as string | undefined);
        await setCustomerBillingStatus(customerId, "active");
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;
      const plan = priceId ? getPlanByStripePriceId(priceId) : null;
      const customer = await getCustomerByStripeCustomerId(subscription.customer as string);
      if (customer && plan) {
        await setCustomerPlan(customer.id, plan.id, subscription.id);
        await setCustomerBillingStatus(customer.id, subscription.status === "active" ? "active" : "pending");
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await getCustomerByStripeCustomerId(subscription.customer as string);
      if (customer) {
        await setCustomerBillingStatus(customer.id, "pending");
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
