import { getDb } from "@/lib/firebase-server";
import { getPlan, PlanId } from "@/lib/plans";

export type CustomerProfile = {
  region: string;
  units: "imperial" | "metric";
  currency: string;
  markupPercent: number;
  notes: string;
};

export const DEFAULT_PROFILE: CustomerProfile = {
  region: "United States",
  units: "imperial",
  currency: "USD",
  markupPercent: 15,
  notes: "",
};

export type BillingStatus = "pending" | "active";

export type Customer = {
  id: string;
  email: string;
  passwordHash: string;
  orgName: string;
  plan: PlanId;
  createdAt: number;
  profile: CustomerProfile;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  /** Gates dashboard access — only "active" once a successful Stripe payment has been recorded. */
  billingStatus: BillingStatus;
};

export type ApiKeyRecord = {
  id: string;
  customerId: string;
  hash: string;
  label: string;
  maskedKey: string;
  createdAt: number;
  revoked: boolean;
  lastUsedAt: number | null;
};

export type UsageLog = {
  id: string;
  customerId: string;
  endpoint: string;
  inputTokens: number;
  outputTokens: number;
  mocked: boolean;
  createdAt: number;
};

const customersCol = () => getDb().collection("customers");
const apiKeysCol = () => getDb().collection("apiKeys");
const usageCol = () => getDb().collection("usage");

/** Generates a random, readable temporary password to email to admin-provisioned customers. */
export function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

/** Admin-provisioned customer — credentials are generated up front and emailed to them. */
export async function createCustomerWithCredentials(email: string, orgName: string, plan: PlanId, passwordHash: string): Promise<string> {
  const ref = await customersCol().add({
    email: email.toLowerCase(),
    passwordHash,
    orgName,
    plan,
    createdAt: Date.now(),
    profile: DEFAULT_PROFILE,
    billingStatus: "pending" as BillingStatus,
  });
  return ref.id;
}

export async function setCustomerBillingStatus(id: string, billingStatus: BillingStatus): Promise<void> {
  await customersCol().doc(id).update({ billingStatus });
}

export async function listAllCustomers(): Promise<Customer[]> {
  const snap = await customersCol().get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Customer)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const snap = await customersCol().where("email", "==", email.toLowerCase()).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Customer;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const doc = await customersCol().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Customer;
}

export async function updateCustomerProfile(id: string, profile: CustomerProfile): Promise<void> {
  await customersCol().doc(id).update({ profile });
}

export async function getCustomerByStripeCustomerId(stripeCustomerId: string): Promise<Customer | null> {
  const snap = await customersCol().where("stripeCustomerId", "==", stripeCustomerId).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Customer;
}

export async function setCustomerStripeCustomerId(id: string, stripeCustomerId: string): Promise<void> {
  await customersCol().doc(id).update({ stripeCustomerId });
}

export async function setCustomerPlan(id: string, plan: PlanId, stripeSubscriptionId?: string): Promise<void> {
  const update: Record<string, unknown> = { plan };
  if (stripeSubscriptionId !== undefined) update.stripeSubscriptionId = stripeSubscriptionId;
  await customersCol().doc(id).update(update);
}

export async function createApiKey(customerId: string, hash: string, label: string, maskedKey: string): Promise<string> {
  const ref = await apiKeysCol().add({
    customerId,
    hash,
    label,
    maskedKey,
    createdAt: Date.now(),
    revoked: false,
    lastUsedAt: null,
  });
  return ref.id;
}

export async function listApiKeys(customerId: string): Promise<ApiKeyRecord[]> {
  const snap = await apiKeysCol().where("customerId", "==", customerId).get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as ApiKeyRecord)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function revokeApiKey(customerId: string, keyId: string): Promise<void> {
  const doc = await apiKeysCol().doc(keyId).get();
  if (!doc.exists || doc.data()?.customerId !== customerId) throw new Error("Key not found");
  await apiKeysCol().doc(keyId).update({ revoked: true });
}

export async function findActiveKeyByHash(hash: string): Promise<ApiKeyRecord | null> {
  const snap = await apiKeysCol().where("hash", "==", hash).where("revoked", "==", false).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as ApiKeyRecord;
}

export async function touchApiKeyUsage(keyId: string): Promise<void> {
  await apiKeysCol().doc(keyId).update({ lastUsedAt: Date.now() });
}

export async function logUsage(entry: Omit<UsageLog, "id" | "createdAt">): Promise<void> {
  await usageCol().add({ ...entry, createdAt: Date.now() });
}

// Firestore requires a manually-provisioned composite index for queries that
// combine an equality filter with a range filter or orderBy on a different
// field. To avoid depending on that infra step, usage is fetched with a
// single equality filter and sorted/filtered in memory — fine at this volume.
async function getAllUsageForCustomer(customerId: string, cap = 2000): Promise<UsageLog[]> {
  const snap = await usageCol().where("customerId", "==", customerId).limit(cap).get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as UsageLog)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getCallsThisPeriod(customerId: string): Promise<number> {
  const periodStart = Date.now() - 1000 * 60 * 60 * 24 * 30;
  const logs = await getAllUsageForCustomer(customerId);
  return logs.filter((log) => log.createdAt >= periodStart).length;
}

export async function getRecentUsage(customerId: string, max = 50): Promise<UsageLog[]> {
  const logs = await getAllUsageForCustomer(customerId);
  return logs.slice(0, max);
}

export async function getUsageBreakdown(customerId: string): Promise<Record<string, number>> {
  const logs = await getRecentUsage(customerId, 500);
  const breakdown: Record<string, number> = {};
  for (const log of logs) {
    breakdown[log.endpoint] = (breakdown[log.endpoint] || 0) + 1;
  }
  return breakdown;
}

export async function getQuotaStatus(customerId: string, planId: PlanId) {
  const plan = getPlan(planId);
  const used = await getCallsThisPeriod(customerId);
  const remaining = plan.monthlyQuota === -1 ? -1 : Math.max(0, plan.monthlyQuota - used);
  const overQuota = plan.monthlyQuota !== -1 && used >= plan.monthlyQuota;
  return { plan, used, remaining, overQuota };
}
