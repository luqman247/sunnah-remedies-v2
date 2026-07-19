"use client";

import { useActionState } from "react";
import { submitAccessCodeAction, type ActionResult } from "@/app/scholar-review/actions";

const initialState: ActionResult = { ok: false };

export function AccessCodeForm() {
  const [state, formAction, pending] = useActionState(submitAccessCodeAction, initialState);

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Sunnah Remedies Scholarly Review</p>
        <h1 style={styles.heading}>Enter your access code</h1>
        <p style={styles.body}>You should have received a short code separately from the person who invited you to review.</p>
        <form action={formAction} style={styles.form}>
          <label htmlFor="accessCode" style={styles.label}>
            Access code
          </label>
          <input id="accessCode" name="accessCode" type="password" autoComplete="off" required style={styles.input} />
          {state.error && (
            <p role="alert" style={styles.error}>
              {state.error}
            </p>
          )}
          <button type="submit" disabled={pending} style={styles.button}>
            {pending ? "Checking…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F6F3EE", padding: "1.5rem" },
  card: { maxWidth: 420, width: "100%", background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "2rem" },
  eyebrow: { margin: 0, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.5rem 0 0.75rem", fontSize: "1.5rem", color: "#0E3B2E" },
  body: { margin: "0 0 1.5rem", color: "#4A4438", lineHeight: 1.6 },
  form: { display: "flex", flexDirection: "column", gap: "0.75rem" },
  label: { fontSize: "0.85rem", color: "#0E3B2E", fontWeight: 600 },
  input: { padding: "0.65rem 0.75rem", border: "1px solid #C9C2B1", borderRadius: 3, fontSize: "1rem" },
  error: { margin: 0, color: "#9A2B2B", fontSize: "0.9rem" },
  button: { marginTop: "0.5rem", padding: "0.7rem 1rem", background: "#0E3B2E", color: "#F6F3EE", border: "none", borderRadius: 3, fontSize: "0.95rem", cursor: "pointer" },
};
