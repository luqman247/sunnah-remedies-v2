"use client";

import { useState } from "react";
import { SolidAction } from "@/components/ui/Links";

interface RegistrationFormProps {
  journeyName: string;
}

export function RegistrationForm({ journeyName }: RegistrationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    if (!data.get("name")) next.name = "We'll need your name to reply.";
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "We'll need a way to reach you — an address like name@example.com.";
    }
    if (!data.get("experience")) {
      next.experience = "Please describe your prior study and walking experience.";
    }
    if (!data.get("acknowledge")) {
      next.acknowledge = "Please confirm you have read the journey description, safety notes, and policies.";
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
        Your interest is registered. The institution will write within fourteen days regarding
        reading review and interview. There is no need to follow up — we answer in time.
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
        <label htmlFor="reg-email">Correspondence address</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" />
        {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
      </div>

      <div className={`form-field ${errors.experience ? "form-field--error" : ""}`}>
        <label htmlFor="reg-experience">
          Prior study and relevant experience (Foundations, walking, retreats)
        </label>
        <textarea id="reg-experience" name="experience" rows={6} />
        {errors.experience && <span className="form-error" role="alert">{errors.experience}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="reg-health">Health conditions the guides should know (optional)</label>
        <textarea id="reg-health" name="health" rows={3} />
      </div>

      <div className={`form-field ${errors.acknowledge ? "form-field--error" : ""}`}>
        <label className="enrolment-form__checkbox">
          <input id="reg-acknowledge" name="acknowledge" type="checkbox" value="yes" />
          <span className="type-body">
            I have read the full journey page for {journeyName} — including safety,
            organisation, packing, and policies. I understand this is a journey, not a holiday.
          </span>
        </label>
        {errors.acknowledge && <span className="form-error" role="alert">{errors.acknowledge}</span>}
      </div>

      <p className="type-small enrolment-form__note">
        Register your interest — not a booking. Placement is confirmed after interview.
        There is no need to decide today. The tradition keeps.
      </p>

      <SolidAction type="submit">Register your interest</SolidAction>
    </form>
  );
}
