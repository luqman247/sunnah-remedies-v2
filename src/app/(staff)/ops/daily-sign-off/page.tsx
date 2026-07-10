"use client";

import { useState } from "react";
import { submitDailySignOff } from "@/lib/operations/actions";

/**
 * Daily Sign-Off form.
 *
 * Staff confirm completion of the daily opening or closing checklist.
 * The actual checklist is printed and worked through physically (appropriate
 * for environments where screens are not always available). This form records
 * the confirmation, timestamp, and any exceptions.
 *
 * @see Phase 4, Chapter 03.3 — Opening SOP
 * @see Phase 4, Chapter 03.4 — Closing SOP
 * @see Phase 4, Chapter 14 — Master checklists (daily opening/closing)
 */
export default function DailySignOffPage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitDailySignOff(formData);
    setResult(res);
    setSubmitting(false);

    if (res.success) {
      e.currentTarget.reset();
    }
  }

  return (
    <article>
      <nav className="mb-6">
        <a href="/ops" className="font-[family-name:var(--font-utility)] text-xs text-emerald/50 hover:text-emerald/80 transition-colors">
          &larr; Operations
        </a>
      </nav>

      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-light text-emerald mb-1">
          Daily Sign-Off
        </h1>
        <p className="font-[family-name:var(--font-body)] text-xs text-emerald/60">
          Confirm the opening or closing checklist is complete. Your name and time are recorded
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Type *
          </label>
          <select
            name="logType"
            required
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40"
          >
            <option value="">Select…</option>
            <option value="daily-opening">Daily Opening</option>
            <option value="daily-closing">Daily Closing</option>
            <option value="clinic-prep">Clinic Room Preparation</option>
            <option value="dispensary-readiness">Dispensary Readiness</option>
          </select>
        </div>

        <div className="p-3 border border-emerald/10 space-y-3">
          <label className="flex items-start gap-2 font-[family-name:var(--font-utility)] text-xs text-emerald/80">
            <input
              name="confirmed"
              type="checkbox"
              value="true"
              required
              className="accent-emerald mt-0.5"
            />
            <span>
              I confirm that all items on the relevant checklist have been completed
              satisfactorily. Any exceptions are noted below
            </span>
          </label>
        </div>

        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Exceptions / Issues
          </label>
          <textarea
            name="exceptions"
            rows={3}
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald placeholder:text-emerald/30 focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40 resize-none"
            placeholder="Record anything that was not at standard and the action taken. Leave blank if none"
          />
        </div>

        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            rows={2}
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald placeholder:text-emerald/30 focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40 resize-none"
            placeholder="Any additional notes for the record…"
          />
        </div>

        {result && (
          <p
            role="status"
            aria-live="polite"
            className={`font-[family-name:var(--font-utility)] text-xs ${result.success ? "text-emerald" : "text-red-700"}`}
          >
            {result.success ? "✓ Sign-off recorded" : `Error: ${result.error}`}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-emerald text-white font-[family-name:var(--font-utility)] text-xs font-medium tracking-wide uppercase hover:bg-emerald/90 focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {submitting ? "Recording…" : "Confirm & sign"}
        </button>
      </form>
    </article>
  );
}
