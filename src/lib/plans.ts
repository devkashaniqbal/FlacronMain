export type PlanId = "starter" | "growth" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  monthlyQuota: number; // API calls per billing period, -1 = unlimited
  priceLabel: string;
  /** Stripe Price ID for subscription checkout. Enterprise has none — it's a custom order. */
  stripePriceId: string | null;
};

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    monthlyQuota: 50_000,
    priceLabel: "$299/mo",
    stripePriceId: process.env.STRIPE_PRICE_STARTER || null,
  },
  growth: {
    id: "growth",
    name: "Growth",
    monthlyQuota: 250_000,
    priceLabel: "$999/mo",
    stripePriceId: process.env.STRIPE_PRICE_GROWTH || null,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    monthlyQuota: -1,
    priceLabel: "Custom",
    stripePriceId: null,
  },
};

export function getPlan(id: string | undefined): Plan {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.starter;
}

export function getPlanByStripePriceId(priceId: string): Plan | null {
  return Object.values(PLANS).find((p) => p.stripePriceId === priceId) ?? null;
}
