/**
 * <Revelation> — Institutional publishing component
 *
 * Renders a single Qur'anic verse or Prophetic tradition
 * with full editorial hierarchy. Usable on any page.
 *
 * When `entries` and `interval` are provided, the component
 * rotates through the collection. The transition resembles
 * light receding and returning — the visitor should barely
 * notice the change has happened.
 *
 * Motion philosophy:
 *   Nothing appears animated. Everything simply appears alive.
 *   Movement resembles changing light inside a library —
 *   the visitor should almost fail to notice it.
 *   Motion exists only to preserve continuity.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RevelationEntry } from "@/lib/content/schema";
import { TYPE_LABELS } from "@/lib/content/schema";

type Variant = "dark" | "light";

interface RevelationProps {
  entry: RevelationEntry;
  entries?: RevelationEntry[];
  interval?: number;
  variant?: Variant;
  showNotes?: boolean;
}

export function Revelation({
  entry: initialEntry,
  entries,
  interval,
  variant = "dark",
  showNotes = false,
}: RevelationProps) {
  const ref = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(initialEntry);
  const [turning, setTurning] = useState(false);
  const indexRef = useRef(-1);
  const reducedMotion = useRef(false);

  const typeLabel = TYPE_LABELS[current.type];
  const hasNotes =
    showNotes &&
    (current.scholarNotes ||
      current.classicalReferences?.length ||
      current.modernNotes);

  const pickNext = useCallback(() => {
    if (!entries || entries.length < 2) return;
    let next: number;
    do {
      next = Math.floor(Math.random() * entries.length);
    } while (next === indexRef.current);
    indexRef.current = next;
    return entries[next];
  }, [entries]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion.current) {
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

  useEffect(() => {
    if (!entries || !interval || entries.length < 2) return;

    const FADE_OUT = reducedMotion.current ? 0 : 1400;

    const timer = setInterval(() => {
      const next = pickNext();
      if (!next) return;

      if (reducedMotion.current) {
        setCurrent(next);
        return;
      }

      setTurning(true);
      setTimeout(() => {
        setCurrent(next);
        setTurning(false);
      }, FADE_OUT);
    }, interval);

    return () => clearInterval(timer);
  }, [entries, interval, pickNext]);

  return (
    <figure
      ref={ref}
      className={`revelation revelation--${variant}${turning ? " revelation--turning" : ""}`}
      data-revelation-type={current.type}
    >
      <p className="revelation__classification revelation__layer">
        {typeLabel}
      </p>

      <blockquote
        className="revelation__text revelation__layer"
        cite={current.reference}
      >
        <p className="revelation__arabic" lang="ar" dir="rtl">
          {current.arabic}
        </p>
      </blockquote>

      <p className="revelation__translation-label revelation__layer">
        Translation
      </p>

      <p className="revelation__english revelation__layer">{current.english}</p>

      <figcaption className="revelation__source revelation__layer">
        {current.source}
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
          {current.scholarNotes && (
            <div className="revelation__note revelation__note--editorial">
              <p className="revelation__note-label">Editorial note</p>
              <p className="revelation__note-text">{current.scholarNotes}</p>
            </div>
          )}

          {current.classicalReferences?.length ? (
            <div className="revelation__note revelation__note--classical">
              <p className="revelation__note-label">Classical references</p>
              <ul className="revelation__note-list">
                {current.classicalReferences.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {current.modernNotes && (
            <div className="revelation__note revelation__note--modern">
              <p className="revelation__note-label">Modern context</p>
              <p className="revelation__note-text">{current.modernNotes}</p>
            </div>
          )}
        </aside>
      )}
    </figure>
  );
}
