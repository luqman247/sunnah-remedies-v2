"use client";

import { useState } from "react";
import { SolidAction } from "@/components/ui/Links";
import { journeyCatalogue } from "@/lib/content/journeys";

interface RegistrationFormProps {
  journeyName?: string;
}

export function RegistrationForm({ journeyName }: RegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const programmeLabel = journeyName ?? "your selected journey";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    if (!data.get("name")) next.name = "Full name is required.";
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address, for example name@example.com.";
    }
    if (!journeyName && !data.get("programme")) {
      next.programme = "Select a journey, or choose undecided.";
    }
    if (!data.get("experience")) {
      next.experience = "Describe your prior study and relevant travel experience.";
    }
    if (!data.get("acknowledge")) {
      next.acknowledge =
        "Confirmation is required before submission.";
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="type-body-l" role="status">
        Your interest has been registered. The institution will contact you
        within fourteen days regarding reading review and interview.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack enrolment-form">
      <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
        <label htmlFor="reg-name">Full name</label>
        <input id="reg-name" name="name" type="text" autoComplete="name" />
        {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
      </div>

      <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
        <label htmlFor="reg-email">Email address</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" />
        {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
      </div>

      {!journeyName && (
        <div className={`form-field ${errors.programme ? "form-field--error" : ""}`}>
          <label htmlFor="reg-programme">Programme</label>
          <select id="reg-programme" name="programme" defaultValue="">
            <option value="" disabled>
              Select a journey
            </option>
            <option value="undecided">Undecided - correspondence welcome</option>
            {journeyCatalogue.map((j) => (
              <option key={j.slug} value={j.slug}>
                {j.name}
              </option>
            ))}
          </select>
          {errors.programme && (
            <span className="form-error" role="alert">{errors.programme}</span>
          )}
        </div>
      )}

      {journeyName && <input type="hidden" name="programme" value={journeyName} />}

      <div className={`form-field ${errors.experience ? "form-field--error" : ""}`}>
        <label htmlFor="reg-experience">
          Prior study and relevant experience (foundations, travel, retreats)
        </label>
        <textarea id="reg-experience" name="experience" rows={6} />
        {errors.experience && (
          <span className="form-error" role="alert">{errors.experience}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="reg-health">Health information relevant to guides (optional)</label>
        <textarea id="reg-health" name="health" rows={3} />
      </div>

      <div className={`form-field ${errors.acknowledge ? "form-field--error" : ""}`}>
        <label className="enrolment-form__checkbox">
          <input id="reg-acknowledge" name="acknowledge" type="checkbox" value="yes" />
          <span className="type-body">
            I confirm that I have read the full journey page for {programmeLabel},
            including safety guidance, logistics, packing, and policies.
          </span>
        </label>
        {errors.acknowledge && (
          <span className="form-error" role="alert">{errors.acknowledge}</span>
        )}
      </div>

      <p className="type-small enrolment-form__note">
        Register your interest; this is not a booking confirmation. Placement
        is offered after review and interview.
      </p>

      <SolidAction type="submit">Register your interest</SolidAction>
    </form>
  );
}
