"use client";

import { useState } from "react";
import { submitTemperatureLog, type TemperatureReading } from "@/lib/operations/actions";

/**
 * Temperature log form.
 *
 * Records storage temperature readings for the dispensary.
 * Designed for quick mobile entry — staff tap through readings
 * at each storage location during the opening routine.
 *
 * @see Phase 4, Chapter 05.3 — Temperature-controlled storage is logged
 * @see Phase 4, Chapter 04.8 — Food safety: temperature control
 */
export default function TemperatureLogPage() {
  const [readings, setReadings] = useState<TemperatureReading[]>([
    { location: "", temperature: 0, withinRange: true },
  ]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  function addReading() {
    setReadings([...readings, { location: "", temperature: 0, withinRange: true }]);
  }

  function updateReading(index: number, field: keyof TemperatureReading, value: string | number | boolean) {
    const updated = [...readings];
    updated[index] = { ...updated[index], [field]: value };
    setReadings(updated);
  }

  function removeReading(index: number) {
    if (readings.length <= 1) return;
    setReadings(readings.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const valid = readings.filter((r) => r.location.trim() !== "");
    if (valid.length === 0) {
      setResult({ success: false, error: "At least one reading with a location is required." });
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.set("readings", JSON.stringify(valid));
    formData.set("notes", notes);

    const res = await submitTemperatureLog(formData);
    setResult(res);
    setSubmitting(false);

    if (res.success) {
      setReadings([{ location: "", temperature: 0, withinRange: true }]);
      setNotes("");
    }
  }

  return (
    <article>
      <nav className="mb-6">
        <a href="/ops" className="font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/50 hover:text-[#0E3B2E]/80 transition-colors">
          &larr; Operations
        </a>
      </nav>

      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-light text-[#0E3B2E] mb-1">
          Temperature Log
        </h1>
        <p className="font-[family-name:var(--font-body)] text-xs text-[#0E3B2E]/60">
          Record storage temperatures at each location. Flag any out-of-range readings.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {readings.map((reading, index) => (
          <div key={index} className="p-3 border border-[#0E3B2E]/10 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Location (e.g. Fridge 1)"
                value={reading.location}
                onChange={(e) => updateReading(index, "location", e.target.value)}
                className="flex-1 px-2 py-1.5 border border-[#0E3B2E]/15 bg-white text-sm text-[#0E3B2E] placeholder:text-[#0E3B2E]/30 focus:outline-none focus:ring-1 focus:ring-[#0E3B2E]/30 focus:border-[#0E3B2E]/40"
              />
              <input
                type="number"
                step="0.1"
                placeholder="°C"
                value={reading.temperature !== 0 ? reading.temperature || "" : "0"}
                onChange={(e) => updateReading(index, "temperature", parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1.5 border border-[#0E3B2E]/15 bg-white text-sm text-[#0E3B2E] text-center focus:outline-none focus:ring-1 focus:ring-[#0E3B2E]/30 focus:border-[#0E3B2E]/40"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/70">
                <input
                  type="checkbox"
                  checked={reading.withinRange}
                  onChange={(e) => updateReading(index, "withinRange", e.target.checked)}
                  className="accent-[#0E3B2E]"
                />
                Within acceptable range
              </label>
              {readings.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReading(index)}
                  className="font-[family-name:var(--font-utility)] text-[10px] text-[#0E3B2E]/40 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addReading}
          className="w-full py-2 border border-dashed border-[#0E3B2E]/20 font-[family-name:var(--font-utility)] text-xs text-[#0E3B2E]/50 hover:text-[#0E3B2E]/80 hover:border-[#0E3B2E]/40 transition-colors"
        >
          + Add reading
        </button>

        <div>
          <label className="block font-[family-name:var(--font-utility)] text-xs font-medium text-[#0E3B2E]/70 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 border border-[#0E3B2E]/15 bg-white text-sm text-[#0E3B2E] placeholder:text-[#0E3B2E]/30 focus:outline-none focus:ring-1 focus:ring-[#0E3B2E]/30 focus:border-[#0E3B2E]/40 resize-none"
            placeholder="Any exceptions or actions taken…"
          />
        </div>

        {result && (
          <p
            role="status"
            aria-live="polite"
            className={`font-[family-name:var(--font-utility)] text-xs ${result.success ? "text-[#0E3B2E]" : "text-red-700"}`}
          >
            {result.success ? "✓ Recorded successfully." : `Error: ${result.error}`}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-[#0E3B2E] text-white font-[family-name:var(--font-utility)] text-xs font-medium tracking-wide uppercase hover:bg-[#0E3B2E]/90 focus:outline-none focus:ring-2 focus:ring-[#0E3B2E]/50 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {submitting ? "Recording…" : "Record temperatures"}
        </button>
      </form>
    </article>
  );
}
