/**
 * Small inline line-icon set for Dhikr collection metadata (timing,
 * repetition, source, translation status, review status). Deliberately
 * minimal — a handful of purpose-built strokes, not a general icon library.
 *
 * Always decorative (aria-hidden) — the adjacent text carries the meaning,
 * per the "icons must remain secondary to the text" requirement. Inherits
 * currentColor via the shared .dhikr-timing-icon class (see
 * dhikr-collection.css) so it always matches its surrounding text colour.
 */

export type DhikrTimingIconName =
  | "morning"
  | "evening"
  | "repetition"
  | "source"
  | "translation"
  | "review-pending"
  | "reviewed";

const PATHS: Record<DhikrTimingIconName, React.ReactNode> = {
  // Sunrise over a horizon line.
  morning: (
    <>
      <path d="M12 3v3.5" />
      <path d="M5.6 8.1 7.7 10" />
      <path d="M18.4 8.1 16.3 10" />
      <circle cx="12" cy="13" r="4" />
      <path d="M3 19h18" />
    </>
  ),
  // Crescent moon with a fine horizon line.
  evening: (
    <>
      <path d="M15.5 5.5a6.5 6.5 0 1 0 3 9.9 8 8 0 0 1-3-9.9Z" />
      <path d="M3 19h18" />
    </>
  ),
  // Circular repeat arrow.
  repetition: (
    <>
      <path d="M4 12a8 8 0 0 1 13.6-5.7L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.6 5.7L4 16" />
      <path d="M4 20v-4h4" />
    </>
  ),
  // Open book.
  source: (
    <>
      <path d="M12 6.5c-1.6-1-4-1.5-6-1.2v11.4c2 -.3 4.4.2 6 1.2 1.6-1 4-1.5 6-1.2V5.3c-2-.3-4.4.2-6 1.2Z" />
      <path d="M12 6.5v11.4" />
    </>
  ),
  // Globe (translation).
  translation: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M4.5 12h15" />
      <path d="M12 4.5c2 2.2 3 5 3 7.5s-1 5.3-3 7.5c-2-2.2-3-5-3-7.5s1-5.3 3-7.5Z" />
    </>
  ),
  // Hourglass (review pending).
  "review-pending": (
    <>
      <path d="M7 4h10" />
      <path d="M7 20h10" />
      <path d="M7 4c0 3 2.2 4.7 3.6 5.9.3.25.3.75 0 1L7 20" />
      <path d="M17 4c0 3-2.2 4.7-3.6 5.9-.3.25-.3.75 0 1L17 20" />
    </>
  ),
  // Check within a rounded shield outline (reviewed).
  reviewed: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.4 3 7.4 7 9 4-1.6 7-4.6 7-9V6l-7-2.5Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

export function DhikrTimingIcon({ name }: { name: DhikrTimingIconName }) {
  return (
    <svg className="dhikr-timing-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
