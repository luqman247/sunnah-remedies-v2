"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { SolidAction, QuietLink } from "@/components/ui/Links";
import { useCounter } from "@/context/CounterContext";
import { formatPrice, primaryReference } from "@/lib/content/remedies";
import type { AcquisitionDetails } from "@/lib/content/types";

type Step = "selection" | "details" | "delivery" | "confirm" | "complete";

const steps: { key: Step; label: string }[] = [
  { key: "selection", label: "I · Selection" },
  { key: "details", label: "II · Details" },
  { key: "delivery", label: "III · Delivery" },
  { key: "confirm", label: "IV · Confirm" },
];

export default function CounterPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCounter } = useCounter();
  const [step, setStep] = useState<Step>("selection");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [details, setDetails] = useState<AcquisitionDetails>({
    name: "",
    email: "",
    address: "",
    city: "",
    postcode: "",
    notes: "",
  });

  function validateDetails() {
    const next: Record<string, string> = {};
    if (!details.name.trim()) next.name = "We'll need your name to reply.";
    if (!details.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
      next.email = "We'll need a way to reach you — an address like name@example.com.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateDelivery() {
    const next: Record<string, string> = {};
    if (!details.address.trim()) next.address = "We'll need an address for delivery.";
    if (!details.city.trim()) next.city = "We'll need a city for delivery.";
    if (!details.postcode.trim()) next.postcode = "We'll need a postcode for delivery.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleComplete() {
    clearCounter();
    setStep("complete");
  }

  if (step === "complete") {
    return (
      <Leaf>
        <div className="measure" style={{ margin: "0 auto" }}>
          <PageIntro section="The Counter" folio="—" title="Dispensation received" />
          <p className="type-body-l">
            Your dispensation is received. We will write to you at {details.email} with
            confirmation and dispatch details — considered, and in time.
          </p>
          <p className="type-body" style={{ marginTop: "var(--s5)" }}>
            <QuietLink href="/the-apothecary">Return to the cabinet</QuietLink>
          </p>
        </div>
      </Leaf>
    );
  }

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Counter"
            folio="i"
            title="The counter"
            lede="Your selection — reviewed before dispensation."
          >
            <p>
              Remedies are dispensed, not sold. Each line carries its grade and source.
              Delivery and fees are stated plainly; nothing is added without disclosure.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure" style={{ margin: "0 auto" }}>
          <nav className="counter-steps" aria-label="Acquisition steps">
            {steps.map(({ key, label }) => (
              <span
                key={key}
                className={`counter-step ${step === key ? "is-active" : ""} ${
                  steps.findIndex((s) => s.key === step) > steps.findIndex((s) => s.key === key)
                    ? "is-complete"
                    : ""
                }`}
              >
                {label}
              </span>
            ))}
          </nav>

          {step === "selection" && (
            <>
              {items.length === 0 ? (
                <>
                  <p className="type-body-l">The counter is empty. The cabinet is here.</p>
                  <p style={{ marginTop: "var(--s5)" }}>
                    <QuietLink href="/the-apothecary">Enter the Apothecary</QuietLink>
                  </p>
                </>
              ) : (
                <>
                  <SectionLabel>Your selection</SectionLabel>
                  {items.map(({ slug, quantity, remedy }) => (
                    <div key={slug} className="counter-line">
                      <div>
                        <Link href={`/the-apothecary/${slug}`} className="counter-line__name">
                          {remedy.name}
                        </Link>
                        <p className="counter-line__provenance">
                          {primaryReference(remedy).grade} · {primaryReference(remedy).source}
                        </p>
                        <p className="type-small" style={{ color: "var(--muted)", marginTop: "var(--s2)" }}>
                          {remedy.volume}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p className="type-title">{formatPrice(remedy.price * quantity)}</p>
                        <div className="counter-qty">
                          <button type="button" onClick={() => updateQuantity(slug, quantity - 1)} aria-label={`Reduce ${remedy.name}`}>−</button>
                          <span className="type-body">{quantity}</span>
                          <button type="button" onClick={() => updateQuantity(slug, quantity + 1)} aria-label={`Increase ${remedy.name}`}>+</button>
                        </div>
                        <button type="button" className="quiet-link" style={{ marginTop: "var(--s2)" }} onClick={() => removeItem(slug)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="counter-summary">
                    <div className="counter-summary__row">
                      <span className="type-body">Subtotal</span>
                      <span className="type-body">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="counter-summary__row">
                      <span className="type-small" style={{ color: "var(--muted)" }}>Delivery</span>
                      <span className="type-small" style={{ color: "var(--muted)" }}>Included within the United Kingdom</span>
                    </div>
                  </div>
                  <p style={{ marginTop: "var(--s5)" }}>
                    <SolidAction type="button" onClick={() => setStep("details")}>
                      Continue
                    </SolidAction>
                  </p>
                </>
              )}
            </>
          )}

          {step === "details" && (
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                if (validateDetails()) setStep("delivery");
              }}
            >
              <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
                <label htmlFor="counter-name">Your name</label>
                <input
                  id="counter-name"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  autoComplete="name"
                />
                {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
              </div>
              <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
                <label htmlFor="counter-email">Correspondence address</label>
                <input
                  id="counter-email"
                  type="email"
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  autoComplete="email"
                />
                {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
              </div>
              <SolidAction type="submit">Continue</SolidAction>
            </form>
          )}

          {step === "delivery" && (
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                if (validateDelivery()) setStep("confirm");
              }}
            >
              <div className={`form-field ${errors.address ? "form-field--error" : ""}`}>
                <label htmlFor="counter-address">Address</label>
                <input
                  id="counter-address"
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  autoComplete="street-address"
                />
                {errors.address && <span className="form-error" role="alert">{errors.address}</span>}
              </div>
              <div className={`form-field ${errors.city ? "form-field--error" : ""}`}>
                <label htmlFor="counter-city">City</label>
                <input
                  id="counter-city"
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  autoComplete="address-level2"
                />
                {errors.city && <span className="form-error" role="alert">{errors.city}</span>}
              </div>
              <div className={`form-field ${errors.postcode ? "form-field--error" : ""}`}>
                <label htmlFor="counter-postcode">Postcode</label>
                <input
                  id="counter-postcode"
                  value={details.postcode}
                  onChange={(e) => setDetails({ ...details, postcode: e.target.value })}
                  autoComplete="postal-code"
                />
                {errors.postcode && <span className="form-error" role="alert">{errors.postcode}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="counter-notes">Notes for delivery (optional)</label>
                <textarea
                  id="counter-notes"
                  value={details.notes}
                  onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <SolidAction type="submit">Continue</SolidAction>
            </form>
          )}

          {step === "confirm" && (
            <>
              <SectionLabel>Summary</SectionLabel>
              {items.map(({ slug, quantity, remedy }) => (
                <div key={slug} className="counter-line">
                  <span className="type-body">{remedy.name} × {quantity}</span>
                  <span className="type-body">{formatPrice(remedy.price * quantity)}</span>
                </div>
              ))}
              <div className="counter-summary">
                <div className="counter-summary__row">
                  <span className="type-title">Total</span>
                  <span className="type-title">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <p className="type-body" style={{ margin: "var(--s5) 0" }}>
                Payment is completed through our secure payment provider. Card and
                credential entry is performed in their interface — the institution
                never captures raw payment credentials.
              </p>
              <SolidAction type="button" onClick={handleComplete}>
                Confirm dispensation
              </SolidAction>
            </>
          )}
        </div>
      </Leaf>
    </>
  );
}
