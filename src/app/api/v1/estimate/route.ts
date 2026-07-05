import { NextRequest, NextResponse } from "next/server";
import { hashApiKey } from "@/lib/api-keys";
import {
  findActiveKeyByHash,
  getCustomerById,
  getQuotaStatus,
  logUsage,
  touchApiKeyUsage,
} from "@/lib/customers-data";
import { buildEstimatePrompt } from "@/lib/prompt-builder";
import { watsonxGenerate } from "@/lib/watsonx";

const ENDPOINT_NAME = "estimate";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const apiKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key. Send it as: Authorization: Bearer <key>" }, { status: 401 });
  }

  const hash = await hashApiKey(apiKey);
  const keyRecord = await findActiveKeyByHash(hash);
  if (!keyRecord) {
    return NextResponse.json({ error: "Invalid or revoked API key" }, { status: 401 });
  }

  const customer = await getCustomerById(keyRecord.customerId);
  if (!customer) {
    return NextResponse.json({ error: "Account not found" }, { status: 401 });
  }
  if (customer.billingStatus !== "active") {
    return NextResponse.json({ error: "This account's billing is not active. Complete payment to restore API access." }, { status: 402 });
  }

  const quota = await getQuotaStatus(customer.id, customer.plan);
  if (quota.overQuota) {
    return NextResponse.json({ error: "Monthly API quota exceeded. Upgrade your plan to continue." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const projectDescription = String(body.projectDescription || "").trim();
  if (!projectDescription) {
    return NextResponse.json({ error: "projectDescription is required" }, { status: 400 });
  }

  const prompt = buildEstimatePrompt(customer.profile, projectDescription);

  let result;
  try {
    result = await watsonxGenerate({ prompt, maxNewTokens: 600 });
  } catch (err) {
    return NextResponse.json({ error: "AI generation failed", detail: (err as Error).message }, { status: 502 });
  }

  await Promise.all([
    touchApiKeyUsage(keyRecord.id),
    logUsage({
      customerId: customer.id,
      endpoint: ENDPOINT_NAME,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      mocked: result.mocked,
    }),
  ]);

  return NextResponse.json({
    estimate: result.text,
    model: result.modelId,
    usage: { inputTokens: result.inputTokens, outputTokens: result.outputTokens },
    quotaRemaining: quota.remaining === -1 ? "unlimited" : quota.remaining - 1,
  });
}
