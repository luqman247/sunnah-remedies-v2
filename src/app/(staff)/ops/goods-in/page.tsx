"use client";

import { useState } from "react";
import { submitGoodsIn } from "@/lib/operations/actions";

/**
 * Goods-In form.
 *
 * Records a batch receipt into the dispensary stock system.
 * Captures provenance, verification status, and condition on arrival.
 * Links to the product reference for full traceability.
 *
 * @see Phase 4, Chapter 05.2 — Goods-in SOP
 * @see Phase 4, Chapter 14 — Goods-in checklist
 */
export default function GoodsInPage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitGoodsIn(formData);
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
          Goods-In
        </h1>
        <p className="font-[family-name:var(--font-body)] text-xs text-emerald/60">
          Record a batch receipt. Nothing enters stock unverified
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Batch / Lot Number *
          </label>
          <input
            name="batchNumber"
            type="text"
            required
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40"
          />
        </div>

        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Supplier *
          </label>
          <input
            name="supplier"
            type="text"
            required
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
              Quantity *
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              required
              className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40"
            />
          </div>
          <div>
            <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
              Expiry Date *
            </label>
            <input
              name="expiryDate"
              type="date"
              required
              className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40"
            />
          </div>
        </div>

        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Storage Location
          </label>
          <input
            name="storageLocation"
            type="text"
            placeholder="e.g. Shelf A3, Fridge 2"
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald placeholder:text-emerald/30 focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40"
          />
        </div>

        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Condition on Receipt
          </label>
          <select
            name="conditionOnReceipt"
            defaultValue="good"
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40"
          >
            <option value="good">Good — no issues</option>
            <option value="minor-issue">Minor issue — noted</option>
            <option value="rejected">Rejected — quarantined</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 font-[family-name:var(--font-utility)] text-xs text-emerald/70">
            <input
              name="provenanceDocumentation"
              type="checkbox"
              value="true"
              className="accent-emerald"
            />
            Provenance documentation present (origin, supplier certification, batch docs)
          </label>
        </div>

        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-emerald/70 mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            rows={2}
            className="w-full px-2 py-1.5 border border-emerald/15 bg-white text-sm text-emerald placeholder:text-emerald/30 focus:outline-none focus:ring-1 focus:ring-emerald/30 focus:border-emerald/40 resize-none"
            placeholder="Any issues, missing documentation, or quarantine notes…"
          />
        </div>

        <input type="hidden" name="productRef" value="" />

        {result && (
          <p
            role="status"
            aria-live="polite"
            className={`font-[family-name:var(--font-utility)] text-xs ${result.success ? "text-emerald" : "text-red-700"}`}
          >
            {result.success ? "✓ Batch recorded successfully" : `Error: ${result.error}`}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-emerald text-white font-[family-name:var(--font-utility)] text-xs font-medium tracking-wide uppercase hover:bg-emerald/90 focus:outline-none focus:ring-2 focus:ring-emerald/50 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {submitting ? "Recording…" : "Record batch"}
        </button>
      </form>
    </article>
  );
}
