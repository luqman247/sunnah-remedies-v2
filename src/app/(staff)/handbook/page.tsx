import { getChapterList } from "@/lib/handbook";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations Handbook",
};

/**
 * Handbook index — table of contents for all chapters.
 *
 * Renders the full chapter listing with role indicators, matching
 * the README structure. Staff can navigate to any chapter.
 *
 * @see Phase 4, Chapter 00 — How the Handbook is organised
 */
export default function HandbookIndexPage() {
  const chapters = getChapterList();

  return (
    <article>
      <header className="mb-10">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-light text-emerald mb-2">
          Institutional Operations Handbook
        </h1>
        <p className="font-[family-name:var(--font-body)] text-sm text-emerald/70 leading-relaxed max-w-2xl">
          The internal operating manual of the headquarters. Read Chapters 00,
          01, and 02, and the chapter for your role. That is enough to begin
        </p>
      </header>

      <div className="border-t border-emerald/10 pt-8">
        <ol className="space-y-1">
          {chapters.map((chapter) => (
            <li key={chapter.slug}>
              <a
                href={`/handbook/${chapter.slug}`}
                className="group flex items-baseline gap-4 py-2 border-b border-emerald/5 hover:border-emerald/20 transition-colors"
              >
                <span className="font-[family-name:var(--font-utility)] text-xs text-emerald/40 tabular-nums w-6 shrink-0">
                  {chapter.number}
                </span>
                <span className="font-[family-name:var(--font-body)] text-sm text-emerald group-hover:text-emerald/80 transition-colors">
                  {chapter.title}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <footer className="mt-12 pt-8 border-t border-emerald/10">
        <p className="font-[family-name:var(--font-utility)] text-xs text-emerald/40">
          Version 1.0 · Classification: Internal · Custodian: Office of the Chief Experience Officer
        </p>
      </footer>
    </article>
  );
}
