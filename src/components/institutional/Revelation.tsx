/**
 * <Revelation> — Institutional publishing component
 *
 * Renders a single Qur'anic verse or Prophetic tradition
 * with full editorial hierarchy. Usable on any page.
 *
 * Motion philosophy:
 *   Nothing appears animated. Everything simply appears alive.
 *   Movement resembles changing light inside a library —
 *   the visitor should almost fail to notice it.
 *   Motion exists only to preserve continuity.
 */

"use client";

import { useEffect, useRef } from "react";
import type { RevelationEntry } from "@/lib/content/schema";
import { TYPE_LABELS } from "@/lib/content/schema";

type Variant = "dark" | "light";

interface RevelationProps {
  entry: RevelationEntry;
  variant?: Variant;
  showNotes?: boolean;
}

export function Revelation({
  entry,
  variant = "dark",
  showNotes = false,
}: RevelationProps) {
  const ref = useRef<HTMLElement>(null);
  const typeLabel = TYPE_LABELS[entry.type];
  const hasNotes =
    showNotes &&
    (entry.scholarNotes ||
      entry.classicalReferences?.length ||
      entry.modernNotes);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revelation--present");
      return;
    }

    const observer = new IntersectionObserver(
      ([observed]) => {
        if (observed.isIntersecting) {
          el.classList.add("revelation--present");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={`revelation revelation--${variant}`}
      data-revelation-type={entry.type}
    >
      <p className="revelation__classification revelation__layer">
        {typeLabel}
      </p>

      <blockquote
        className="revelation__text revelation__layer"
        cite={entry.reference}
      >
        <p className="revelation__arabic" lang="ar" dir="rtl">
          {entry.arabic}
        </p>
      </blockquote>

      <p className="revelation__translation-label revelation__layer">
        Translation
      </p>

      <p className="revelation__english revelation__layer">{entry.english}</p>

      <figcaption className="revelation__source revelation__layer">
        {entry.source}
      </figcaption>

      {/* ── Editorial photography (future) ────────────────
       *  When entry.editorial?.status === "final", render
       *  the image here as .revelation__plate. Photography
       *  must never compete with Revelation for attention.
       *  It exists to deepen the stillness of the room.
       *  See EditorialPhotography in schema.ts for the
       *  three-state asset lifecycle (brief/interim/final).
       * ─────────────────────────────────────────────────── */}

      {hasNotes && (
        <aside
          className="revelation__notes revelation__layer"
          aria-label="Scholarly notes"
        >
          {entry.scholarNotes && (
            <div className="revelation__note revelation__note--editorial">
              <p className="revelation__note-label">Editorial note</p>
              <p className="revelation__note-text">{entry.scholarNotes}</p>
            </div>
          )}

          {entry.classicalReferences?.length ? (
            <div className="revelation__note revelation__note--classical">
              <p className="revelation__note-label">Classical references</p>
              <ul className="revelation__note-list">
                {entry.classicalReferences.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {entry.modernNotes && (
            <div className="revelation__note revelation__note--modern">
              <p className="revelation__note-label">Modern context</p>
              <p className="revelation__note-text">{entry.modernNotes}</p>
            </div>
          )}
        </aside>
      )}
    </figure>
  );
}
