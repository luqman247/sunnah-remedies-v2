/**
 * Order confirmation page — post-checkout return from Shopify.
 *
 * Visitors are redirected here after completing Shopify checkout.
 * Displays a calm, institutional confirmation. No upsell, no urgency.
 *
 * @see Phase 4 Part 2, Spec 03 §3.6
 */

import { Metadata } from "next";
import { colors } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Order Confirmed — Sunnah Remedies",
  robots: { index: false },
};

export default function OrderConfirmationPage() {
  return (
    <main
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "120px 24px 80px",
      }}
    >
      <header style={{ marginBottom: "48px" }}>
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: colors.muted,
            marginBottom: "16px",
          }}
        >
          The Apothecary
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "28px",
            fontWeight: 400,
            lineHeight: 1.3,
            color: colors.myrtle,
            marginBottom: "16px",
          }}
        >
          Your order has been received
        </h1>
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            color: colors.ink,
          }}
        >
          We are preparing your remedies with care. You will receive a confirmation
          email shortly with your order details and tracking information
        </p>
      </header>

      <section
        style={{
          padding: "32px",
          border: `1px solid ${colors.paperDeep}`,
          marginBottom: "48px",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: colors.muted,
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          What happens next
        </h2>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {[
            "You will receive an email confirming your order",
            "Your remedies will be carefully prepared and packed",
            "You will be notified when your order is dispatched",
            "Allow 2–5 working days for delivery within the UK",
          ].map((step, i) => (
            <li
              key={i}
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: colors.ink,
                paddingLeft: "24px",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  color: colors.muted,
                  fontSize: "12px",
                }}
              >
                {i + 1}.
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <footer>
        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.7,
            color: colors.mutedLight,
            fontStyle: "italic",
          }}
        >
          Healing is from Allah — the remedy is a means
        </p>
      </footer>
    </main>
  );
}
