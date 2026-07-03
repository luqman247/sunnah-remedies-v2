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
      newErrors.name = "We'll need your name to reply.";
    }
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email =
        "We'll need a way to reach you — an address like name@example.com.";
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
            lede="The patient received as a guest. Limits stated up front."
          >
            <p>
              Consultations are offered as a means of clinical guidance within the
              tradition of Prophetic Medicine. Healing is from Allah; we promise a
              means, never a cure. A remedy is not a substitute for a physician.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure" style={{ margin: "0 auto" }}>
          {submitted ? (
            <p className="type-body-l">
              Your request is received. We will write to you within five days.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="form-stack">
              <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
                <label htmlFor="name">Your name</label>
                <input id="name" name="name" type="text" autoComplete="name" />
                {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
              </div>

              <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
                <label htmlFor="email">Your correspondence address</label>
                <input id="email" name="email" type="email" autoComplete="email" />
                {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="concern">What brings you (optional)</label>
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
