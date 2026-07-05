/**
 * CorrespondenceForm — the single invitation/CTA (Ch. 9.7).
 *
 * Collects and validates email. Actual submission is a server action
 * that targets the institution's own provider (configured separately).
 */

"use client";

import { useState, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";

interface CorrespondenceContent {
  heading: string;
  body: string;
  placeholder: string;
  consentText: string;
  successText: string;
}

interface CorrespondenceFormProps {
  content: CorrespondenceContent;
}

export function CorrespondenceForm({ content }: CorrespondenceFormProps) {
  const tForm = useTranslations("form");
  const tArrival = useTranslations("arrival.correspondence");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "validating" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("validating");

    if (!email || !email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setErrorMessage(tForm("validation.email"));
      inputRef.current?.focus();
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMessage(data.error || tForm("error"));
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(tForm("serverError"));
    }
  }

  if (status === "success") {
    return (
      <div className="correspondence-form">
        <p className="correspondence-success" role="status" aria-live="polite">
          {content.successText}
        </p>
      </div>
    );
  }

  return (
    <div className="correspondence-form">
      <h2 className="type-section-title" style={{ marginBlockEnd: "var(--space-4)" }}>
        {content.heading}
      </h2>
      <p className="type-body-v2" style={{ marginBlockEnd: "var(--space-6)" }}>
        {content.body}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="correspondence-email" className="sr-only">
          {tArrival("emailLabel")}
        </label>
        <input
          ref={inputRef}
          id="correspondence-email"
          type="email"
          className="correspondence-input"
          placeholder={content.placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          aria-describedby={status === "error" ? "correspondence-error" : undefined}
          aria-invalid={status === "error" ? "true" : undefined}
        />

        {status === "error" && (
          <p
            id="correspondence-error"
            className="correspondence-error"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="correspondence-submit"
          disabled={status === "validating"}
        >
          {status === "validating" ? tArrival("requesting") : tArrival("submit")}
        </button>
      </form>

      <p className="type-caption" style={{ marginBlockStart: "var(--space-4)", maxInlineSize: "48ch" }}>
        {content.consentText}
      </p>
    </div>
  );
}
