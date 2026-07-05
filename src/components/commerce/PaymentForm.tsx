/**
 * Stripe Elements provider — wraps payment forms in institutional pages.
 *
 * Loads Stripe.js client-side only. Card data never touches our servers.
 * Supports Apple Pay and Google Pay via Payment Request Button.
 *
 * @see Phase 4 Part 2, Spec 04 §4.4
 */

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

interface PaymentFormProps {
  clientSecret: string;
  onSuccess?: (intentId: string) => void;
  onError?: (message: string) => void;
  returnUrl: string;
}

export function PaymentFormWrapper({
  clientSecret,
  onSuccess,
  onError,
  returnUrl,
}: PaymentFormProps) {
  if (!stripePromise) return null;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0E3B2E",
        colorBackground: "#FAFAF8",
        colorText: "#2C2C2C",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        borderRadius: "2px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        onSuccess={onSuccess}
        onError={onError}
        returnUrl={returnUrl}
      />
    </Elements>
  );
}

function PaymentForm({
  onSuccess,
  onError,
  returnUrl,
}: Omit<PaymentFormProps, "clientSecret">) {
  const t = useTranslations("commerce.payment");
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setIsProcessing(true);
      setMessage(null);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message ?? t("failed"));
        onError?.(error.message ?? t("failed"));
      } else if (paymentIntent?.status === "succeeded") {
        setMessage(null);
        onSuccess?.(paymentIntent.id);
      }

      setIsProcessing(false);
    },
    [stripe, elements, returnUrl, onSuccess, onError, t]
  );

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {message && (
        <p
          role="alert"
          aria-live="assertive"
          style={{
            marginTop: "12px",
            fontSize: "13px",
            color: "#B91C1C",
          }}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          marginTop: "24px",
          width: "100%",
          padding: "14px 24px",
          backgroundColor: "#0E3B2E",
          color: "#FAFAF8",
          border: "none",
          fontSize: "14px",
          letterSpacing: "0.04em",
          cursor: isProcessing ? "wait" : "pointer",
          opacity: isProcessing ? 0.7 : 1,
        }}
      >
        {isProcessing ? t("processing") : t("submit")}
      </button>
    </form>
  );
}
