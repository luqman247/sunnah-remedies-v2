"use client";

import { useActionState } from "react";
import { submitReviewerIdentityAction, type ActionResult } from "@/app/scholar-review/actions";

const initialState: ActionResult = { ok: false };

export function ReviewerIdentityForm() {
  const [state, formAction, pending] = useActionState(submitReviewerIdentityAction, initialState);

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Sunnah Remedies Scholarly Review</p>
        <h1 style={styles.heading}>Before you begin</h1>
        <p style={styles.body}>
          This is asked once, at the start of your review. It is stored only for this review and is never shown on the public
          website.
        </p>
        <form action={formAction} style={styles.form}>
          <div>
            <label htmlFor="fullName" style={styles.label}>
              Full name
            </label>
            <input id="fullName" name="fullName" type="text" required autoComplete="name" style={styles.input} />
          </div>
          <div>
            <label htmlFor="roleOrQualification" style={styles.label}>
              Role or qualification
            </label>
            <input id="roleOrQualification" name="roleOrQualification" type="text" required placeholder="e.g. Islamic scholar, hadith specialist" style={styles.input} />
          </div>
          <div>
            <label htmlFor="organisation" style={styles.label}>
              Organisation (optional)
            </label>
            <input id="organisation" name="organisation" type="text" style={styles.input} />
          </div>
          <div>
            <label htmlFor="email" style={styles.label}>
              Email (optional)
            </label>
            <input id="email" name="email" type="email" autoComplete="email" style={styles.input} />
          </div>
          {state.error && (
            <p role="alert" style={styles.error}>
              {state.error}
            </p>
          )}
          <button type="submit" disabled={pending} style={styles.button}>
            {pending ? "Starting…" : "Start review"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F6F3EE", padding: "1.5rem" },
  card: { maxWidth: 480, width: "100%", background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "2rem" },
  eyebrow: { margin: 0, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.5rem 0 0.75rem", fontSize: "1.5rem", color: "#0E3B2E" },
  body: { margin: "0 0 1.5rem", color: "#4A4438", lineHeight: 1.6, fontSize: "0.92rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  label: { display: "block", marginBottom: "0.3rem", fontSize: "0.85rem", color: "#0E3B2E", fontWeight: 600 },
  input: { width: "100%", boxSizing: "border-box", padding: "0.6rem 0.75rem", border: "1px solid #C9C2B1", borderRadius: 3, fontSize: "1rem" },
  error: { margin: 0, color: "#9A2B2B", fontSize: "0.9rem" },
  button: { marginTop: "0.25rem", padding: "0.7rem 1rem", background: "#0E3B2E", color: "#F6F3EE", border: "none", borderRadius: 3, fontSize: "0.95rem", cursor: "pointer" },
};
