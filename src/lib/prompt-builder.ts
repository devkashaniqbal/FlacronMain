import type { CustomerProfile } from "@/lib/customers-data";

/**
 * Assembles a personalized prompt for a given task by combining a fixed
 * task instruction with the customer's stored profile (region, units,
 * currency, markup, notes). This is "Layer 1" personalization — no
 * retrieval or fine-tuning, just structured context injection.
 */
export function buildEstimatePrompt(profile: CustomerProfile, projectDescription: string): string {
  return [
    "You are a construction cost estimation assistant.",
    `Region: ${profile.region}. Use construction norms and pricing typical for this region.`,
    `Units: ${profile.units === "imperial" ? "imperial (ft, sq ft)" : "metric (m, sq m)"}.`,
    `Currency: ${profile.currency}.`,
    `Apply a contractor markup of ${profile.markupPercent}% on materials and labor subtotal.`,
    profile.notes ? `Additional context from this customer: ${profile.notes}` : "",
    "",
    "Produce a itemized estimate with: scope summary, material costs, labor costs, markup, and total.",
    "",
    `Project: ${projectDescription}`,
  ]
    .filter(Boolean)
    .join("\n");
}
