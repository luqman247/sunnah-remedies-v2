"use client";

import { useState } from "react";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { SolidAction } from "@/components/ui/Links";

export default function ConsultationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newErrors: Record<string, string> = {};

    if (!data.get("name")) {
      newErrors.name = "Name is required.";
    }
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "A valid email address is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Consultations"
            folio="i"
            title="Clinical reception"
            lede="The patient is received as a guest. Limits are stated plainly."
          >
            <p>
              Consultations offer clinical guidance within the tradition of
              Prophetic Medicine. Healing is from Allah; the consultation offers
              means and does not promise cure. Remedies do not replace medical
              care from a physician.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure" style={{ margin: "0 auto" }}>
          {submitted ? (
            <p className="type-body-l">
              Your request has been received. We will write within five working
              days.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="form-stack">
              <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" autoComplete="name" />
                {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
              </div>

              <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
                <label htmlFor="email">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" />
                {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="concern">Clinical concern (optional)</label>
                <textarea id="concern" name="concern" rows={5} />
              </div>

              <SolidAction type="submit">Request a consultation</SolidAction>
            </form>
          )}
        </div>
      </Leaf>
    </>
  );
}
