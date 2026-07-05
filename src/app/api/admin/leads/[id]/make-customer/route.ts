import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getDb } from "@/lib/firebase-server";
import {
  createCustomerWithCredentials,
  generateTemporaryPassword,
  getCustomerByEmail,
  setCustomerStripeCustomerId,
} from "@/lib/customers-data";
import { hashPassword } from "@/lib/customer-auth";
import { getPlan, type PlanId } from "@/lib/plans";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

function guessPlan(text: string): PlanId {
  const lower = text.toLowerCase();
  if (lower.includes("enterprise")) return "enterprise";
  if (lower.includes("growth")) return "growth";
  return "starter";
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const leadDoc = await db.collection("leads").doc(id).get();
  if (!leadDoc.exists) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const lead = leadDoc.data() as {
    name: string;
    email: string;
    company?: string;
    subject?: string;
    product?: string;
  };

  if (!lead.email) return NextResponse.json({ error: "Lead has no email" }, { status: 400 });

  const existing = await getCustomerByEmail(lead.email);
  if (existing) {
    return NextResponse.json({ error: "A customer account already exists for this email" }, { status: 409 });
  }

  const orgName = lead.company || lead.name;
  const planId = guessPlan(`${lead.subject || ""} ${lead.product || ""}`);
  const plan = getPlan(planId);

  const temporaryPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(temporaryPassword);
  const customerId = await createCustomerWithCredentials(lead.email, orgName, planId, passwordHash);

  const origin = request.nextUrl.origin;
  const loginLink = `${origin}/dashboard/login`;
  let paymentLink = `${origin}/dashboard/billing`;

  if (plan.stripePriceId && isStripeConfigured()) {
    try {
      const stripe = getStripe();
      const stripeCustomer = await stripe.customers.create({
        email: lead.email,
        name: orgName,
        metadata: { flacronCustomerId: customerId },
      });
      await setCustomerStripeCustomerId(customerId, stripeCustomer.id);

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomer.id,
        line_items: [{ price: plan.stripePriceId, quantity: 1 }],
        success_url: `${origin}/dashboard?checkout=success`,
        cancel_url: `${origin}/dashboard/billing?checkout=cancelled`,
        metadata: { customerId, planId: plan.id },
        subscription_data: { metadata: { customerId, planId: plan.id } },
      });
      if (session.url) paymentLink = session.url;
    } catch (err) {
      console.error("Stripe checkout creation failed during customer provisioning:", err);
    }
  }

  try {
    await sendEmail({
      to: lead.email,
      toName: lead.name,
      subject: "Your Flacron AI Engine dashboard login",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#0f172a;padding:28px 32px;border-radius:12px 12px 0 0;">
            <span style="color:#F97316;font-size:22px;font-weight:900;letter-spacing:2px;">FLACRON</span>
          </div>
          <div style="padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
            <h2 style="color:#0f172a;margin-top:0;">Welcome, ${orgName}!</h2>
            <p style="color:#475569;line-height:1.6;">
              Your Flacron AI Engine account has been created on the <strong>${plan.name}</strong> plan (${plan.priceLabel}). Here are your login details:
            </p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin:20px 0;">
              <p style="margin:0 0 8px;color:#0f172a;"><strong>Email:</strong> ${lead.email}</p>
              <p style="margin:0;color:#0f172a;"><strong>Temporary password:</strong> <code style="background:#fff;padding:2px 6px;border-radius:4px;">${temporaryPassword}</code></p>
            </div>
            <p style="margin:24px 0;">
              <a href="${loginLink}" style="background:#F97316;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Sign In to Your Dashboard</a>
            </p>
            <p style="margin:24px 0;">
              <a href="${paymentLink}" style="background:#0f172a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Complete Payment</a>
            </p>
            <p style="color:#94a3b8;font-size:13px;line-height:1.6;">
              You'll need to complete payment before your dashboard unlocks. You can change your password from Settings after signing in.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send provisioning email:", err);
  }

  await db.collection("leads").doc(id).update({
    convertedCustomerId: customerId,
    status: "qualified",
  });

  return NextResponse.json({ ok: true, customerId, temporaryPassword, loginLink, paymentLink });
}
