/**
 * Phase 8 — Resend Transactional Email Service
 *
 * All system-triggered email: order confirmations, certificates,
 * password resets, consultation confirmations, etc.
 *
 * Uses React Email templates composed from the shared institutional
 * component library. Identity tokens from Phase 1.
 */

import { Resend } from "resend";
import { db, schema } from "../../db";
import { eq } from "drizzle-orm";
import { logger } from "../../logging";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "mail@sunnahremedies.com";
const FROM_NAME = "Sunnah Remedies";

export interface TransactionalEmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
  replyTo?: string;
}

export async function sendTransactionalEmail(options: TransactionalEmailOptions): Promise<string | null> {
  const { to, subject, template, data, replyTo } = options;

  const suppressed = await db
    .select()
    .from(schema.emailSuppressions)
    .where(eq(schema.emailSuppressions.email, to))
    .limit(1);

  if (suppressed.length > 0) {
    logger.warn("Email suppressed — address on suppression list", { to, template });
    return null;
  }

  try {
    const html = renderTemplate(template, data);

    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_ADDRESS}>`,
      to,
      subject,
      html,
      replyTo: replyTo ?? FROM_ADDRESS,
      tags: [
        { name: "template", value: template },
        { name: "institution", value: "sunnah-remedies" },
      ],
    });

    const emailId = result.data?.id ?? null;

    await db.insert(schema.communications).values({
      channel: "email",
      type: template,
      subject,
      templateId: template,
      resendId: emailId ?? undefined,
      status: "sent",
    });

    logger.info("Transactional email sent", { to, template, emailId });
    return emailId;
  } catch (error) {
    logger.error("Failed to send transactional email", {
      to,
      template,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

export async function sendBatchEmails(
  recipients: Array<{ to: string; subject: string; template: string; data: Record<string, unknown> }>
): Promise<Array<string | null>> {
  const results: Array<string | null> = [];
  for (const recipient of recipients) {
    try {
      const id = await sendTransactionalEmail(recipient);
      results.push(id);
    } catch {
      results.push(null);
    }
  }
  return results;
}

/**
 * Renders an email template to HTML using the institutional design tokens.
 * All emails share the same visual identity: clinical-green palette,
 * brass isnād divider, sanctioned typefaces with email-safe fallbacks.
 */
function renderTemplate(template: string, data: Record<string, unknown>): string {
  const { masthead, isnadDivider, footer } = getSharedComponents();

  const bodyContent = getTemplateBody(template, data);

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${data.subject ?? "Sunnah Remedies"}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #ECE6D6; font-family: 'Georgia', 'Times New Roman', serif; color: #23201A; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; }
    .masthead { background-color: #0A2B21; padding: 32px 40px; text-align: center; }
    .masthead img { max-width: 200px; height: auto; }
    .masthead-title { color: #ECE6D6; font-family: 'Georgia', serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 12px; }
    .isnad-rule { height: 1px; background-color: #96763F; margin: 0 40px; }
    .body-content { padding: 40px; line-height: 1.7; font-size: 15px; color: #23201A; }
    .body-content h2 { font-family: 'Georgia', serif; font-size: 20px; font-weight: 400; color: #0A2B21; margin: 0 0 16px; }
    .body-content p { margin: 0 0 16px; }
    .cta { display: inline-block; background-color: #0A2B21; color: #ECE6D6; padding: 14px 28px; text-decoration: none; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .receipt-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .receipt-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6E6656; border-bottom: 1px solid #D6CCB5; padding: 8px 0; }
    .receipt-table td { padding: 12px 0; border-bottom: 1px solid #D6CCB5; font-size: 14px; }
    .footer { background-color: #1E2A22; padding: 32px 40px; text-align: center; }
    .footer p { color: #9A9081; font-size: 12px; line-height: 1.6; margin: 0 0 8px; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .footer a { color: #B79A67; text-decoration: underline; }
    .arabic { font-family: 'Amiri', 'Traditional Arabic', serif; direction: rtl; text-align: right; }
    @media (max-width: 600px) {
      .body-content { padding: 24px; }
      .masthead { padding: 24px; }
      .footer { padding: 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${masthead}
    ${isnadDivider}
    <div class="body-content">
      ${bodyContent}
    </div>
    ${isnadDivider}
    ${footer}
  </div>
</body>
</html>`;
}

function getSharedComponents() {
  return {
    masthead: `<div class="masthead">
      <div style="font-family: 'Georgia', serif; font-size: 18px; color: #ECE6D6; letter-spacing: 3px;">SUNNAH REMEDIES</div>
      <div class="masthead-title">Institute of Prophetic Medicine</div>
    </div>`,
    isnadDivider: `<div class="isnad-rule"></div>`,
    footer: `<div class="footer">
      <p>Sunnah Remedies — Institute of Prophetic Medicine</p>
      <p>London, United Kingdom</p>
      <p style="margin-top: 16px;"><a href="{{unsubscribe_url}}">Unsubscribe</a> · <a href="https://sunnahremedies.com/privacy">Privacy</a></p>
      <p style="color: #6E6656; font-size: 10px; margin-top: 16px;">This email was sent by Sunnah Remedies Ltd. You are receiving this because of your relationship with the institution.</p>
    </div>`,
  };
}

function getTemplateBody(template: string, data: Record<string, unknown>): string {
  switch (template) {
    case "order-confirmation":
      return `<h2>Order Confirmed</h2>
        <p>Thank you for your order. Your payment has been received and your order is being prepared.</p>
        <table class="receipt-table">
          <thead><tr><th>Item</th><th>Qty</th><th>Amount</th></tr></thead>
          <tbody>${(data.lineItems as Array<{ productId: string; quantity: number; amount: number }>)?.map(
            (item) => `<tr><td>${item.productId}</td><td>${item.quantity}</td><td>${data.currency} ${item.amount}</td></tr>`
          ).join("") ?? ""}</tbody>
          <tfoot><tr><td colspan="2"><strong>Total</strong></td><td><strong>${data.currency} ${data.totalAmount}</strong></td></tr></tfoot>
        </table>`;

    case "order-shipped":
      return `<h2>Your Order Has Shipped</h2>
        <p>Your order is on its way.</p>
        ${data.trackingNumber ? `<p>Tracking number: <strong>${data.trackingNumber}</strong></p>` : ""}
        ${data.carrier ? `<p>Carrier: ${data.carrier}</p>` : ""}`;

    case "order-refunded":
      return `<h2>Refund Processed</h2>
        <p>A refund of <strong>${data.currency} ${data.refundAmount}</strong> has been processed for your order.</p>
        <p>Please allow 5–10 business days for the refund to appear in your account.</p>`;

    case "course-enrolment":
      return `<h2>Enrolment Confirmed</h2>
        <p>You have been enrolled in your course at The Academy.</p>
        <p>We will send you further details about your first session and how to prepare.</p>`;

    case "course-reminder":
      return `<h2>Session Reminder</h2>
        <p>Your next session is approaching on <strong>${data.scheduledAt}</strong>.</p>`;

    case "consultation-confirmation":
      return `<h2>Consultation Confirmed</h2>
        <p>Your consultation has been confirmed for <strong>${data.scheduledAt}</strong>.</p>
        <p>Please complete your pre-appointment questionnaire beforehand.</p>`;

    case "consultation-reminder":
      return `<h2>Consultation Reminder</h2>
        <p>Your consultation is ${data.hoursUntil as number <= 2 ? "starting soon" : "tomorrow"}.</p>`;

    case "consultation-followup":
      return `<h2>After Your Consultation</h2>
        <p>Thank you for consulting with us. We hope the session was beneficial.</p>
        <p>If you have any questions about the guidance provided, please do not hesitate to contact us.</p>`;

    case "consultation-feedback":
      return `<h2>Your Experience</h2>
        <p>We would value your feedback on your recent consultation.</p>
        <p>Your thoughts help us maintain the standards expected of this institution.</p>`;

    case "journey-confirmation":
      return `<h2>Sacred Journey Confirmed</h2>
        <p>Your registration for the Sacred Journey has been confirmed.</p>
        <p>You will receive preparation materials in the coming days.</p>`;

    case "journey-preparation":
      return `<h2>Journey Preparation</h2>
        <p>Your journey is approaching. Please review the preparation materials below.</p>`;

    case "journey-followup":
      return `<h2>Reflections on Your Journey</h2>
        <p>We hope your journey was a transformative experience. Take time to reflect on what you have learned.</p>`;

    case "certificate":
      return `<h2>Certificate of Completion</h2>
        <p>Congratulations on completing your course.</p>
        <p>Your certificate number is <strong>${data.certificateNumber}</strong>.</p>
        <p>This certificate can be verified through the institution's register.</p>`;

    case "invoice":
      return `<h2>Invoice</h2>
        <p>Invoice number: <strong>${data.invoiceId}</strong></p>
        <p>Total: <strong>${data.currency} ${data.totalAmount}</strong> (VAT: ${data.currency} ${data.vatAmount})</p>`;

    case "cart-reminder":
      return `<h2>Your Items Are Waiting</h2>
        <p>You have items in your basket. We have held them for you.</p>`;

    case "cart-educational":
      return `<h2>The Tradition Behind Your Selection</h2>
        <p>Each remedy in the Sunnah Remedies apothecary is selected, sourced, and prepared with care rooted in the Prophetic tradition.</p>`;

    case "cart-final-recovery":
      return `<h2>Can We Help?</h2>
        <p>If you have any questions about the items in your basket, our team is here to assist.</p>`;

    case "password-reset":
      return `<h2>Password Reset</h2>
        <p>A password reset was requested for your account.</p>
        <p><a href="${data.resetUrl}" class="cta">Reset Password</a></p>
        <p>If you did not request this, please disregard this email.</p>`;

    case "email-verification":
      return `<h2>Verify Your Email</h2>
        <p>Please verify your email address to complete your registration.</p>
        <p><a href="${data.verifyUrl}" class="cta">Verify Email</a></p>`;

    case "waitlist-available":
      return `<h2>A Place Is Now Available</h2>
        <p>A place has become available for the ${data.entityType} you were waiting for.</p>`;

    default:
      return `<p>${JSON.stringify(data)}</p>`;
  }
}
