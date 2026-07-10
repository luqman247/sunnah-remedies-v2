import { getChapter, getChapterList } from "@/lib/handbook";
import { renderMarkdown } from "@/lib/handbook/render";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "Not Found" };
  return { title: `Ch ${chapter.number} · ${chapter.title}` };
}

export function generateStaticParams() {
  return getChapterList().map((ch) => ({ chapter: ch.slug }));
}

/**
 * Individual handbook chapter page.
 *
 * Renders the markdown content of a single chapter with minimal,
 * typographically considered styling appropriate for sustained reading.
 * Navigation between chapters is provided at the foot of each page.
 */
export default async function ChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const chapters = getChapterList();
  const currentIndex = chapters.findIndex((ch) => ch.slug === chapter.slug);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const html = renderMarkdown(chapter.content);

  return (
    <article>
      <nav className="mb-8">
        <a
          href="/handbook"
          className="font-[family-name:var(--font-utility)] text-xs text-emerald/50 hover:text-emerald/80 transition-colors"
        >
          &larr; All chapters
        </a>
      </nav>

      <div
        className="handbook-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <nav className="mt-12 pt-8 border-t border-emerald/10 flex justify-between">
        {prevChapter ? (
          <a
            href={`/handbook/${prevChapter.slug}`}
            className="font-[family-name:var(--font-utility)] text-xs text-emerald/60 hover:text-emerald transition-colors"
          >
            &larr; Ch {prevChapter.number}
          </a>
        ) : (
          <span />
        )}
        {nextChapter ? (
          <a
            href={`/handbook/${nextChapter.slug}`}
            className="font-[family-name:var(--font-utility)] text-xs text-emerald/60 hover:text-emerald transition-colors"
          >
            Ch {nextChapter.number} &rarr;
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
