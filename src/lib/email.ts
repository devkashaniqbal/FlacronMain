const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export function isEmailConfigured(): boolean {
  return !!process.env.BREVO_API_KEY;
}

export type SendEmailInput = {
  to: string;
  toName?: string;
  subject: string;
  html: string;
};

/**
 * Sends a transactional email via Brevo. No-ops with a console warning when
 * BREVO_API_KEY isn't configured, so flows that trigger email (like
 * provisioning a customer) don't hard-fail in environments without it set up.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn(`[email] BREVO_API_KEY not configured — skipping email to ${input.to}: "${input.subject}"`);
    return;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || "marketing@flacronenterprises.com";
  const senderName = process.env.BREVO_SENDER_NAME || "Flacron Enterprises";

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.BREVO_API_KEY as string,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: input.to, name: input.toName || input.to }],
      subject: input.subject,
      htmlContent: input.html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Brevo send failed: ${res.status} ${await res.text()}`);
  }
}
