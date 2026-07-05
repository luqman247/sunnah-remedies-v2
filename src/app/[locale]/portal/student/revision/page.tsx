import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { getDueFlashcards, getFlashcards } from "@/modules/student/flashcards";
import { getCourseNotes } from "@/modules/student/notes";
import { getEnrolments } from "@/modules/student/enrolments";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.student.revision", "/portal/student/revision");
}

export default async function RevisionPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal("/portal/student/revision");
  const [due, allCards, notes, enrolments] = await Promise.all([
    getDueFlashcards(session.accountId),
    getFlashcards(session.accountId),
    getCourseNotes(session.accountId),
    getEnrolments(session.accountId),
  ]);

  return (
    <StudentSectionPage
      folio="iii"
      title="Revision"
      lede="Flashcards and private notes — spaced repetition for retention"
      currentHref="/portal/student/revision"
      breadcrumbLabel="Revision"
    >
      <section className="policy-block">
        <h2 className="type-title">Flashcards due</h2>
        {due.length === 0 ? (
          <p className="type-body">No flashcards due for review today</p>
        ) : (
          due.map(({ deck }) => (
            <article key={deck.id} className="specimen" style={{ marginBottom: "var(--s4)" }}>
              <p className="type-title">{deck.front}</p>
              <p className="type-body">{deck.back}</p>
            </article>
          ))
        )}
        <p className="type-micro" style={{ color: "var(--muted)", marginTop: "var(--s3)" }}>
          {allCards.length} card{allCards.length === 1 ? "" : "s"} in your decks
        </p>
      </section>

      <section className="policy-block">
        <h2 className="type-title">Course notes</h2>
        {notes.length === 0 ? (
          <p className="type-body">No private notes yet — add notes from lesson pages</p>
        ) : (
          notes.map((n) => (
            <article key={n.id} style={{ marginBottom: "var(--s4)" }}>
              <p className="type-body">{n.body}</p>
              <p className="type-micro" style={{ color: "var(--muted)" }}>
                {new Date(n.updatedAt).toLocaleDateString(locale)}
              </p>
            </article>
          ))
        )}
      </section>

      {enrolments.length > 0 && (
        <p className="type-micro" style={{ color: "var(--muted)" }}>
          Flashcards can be generated from course material via the AI Tutor revision mode
        </p>
      )}
    </StudentSectionPage>
  );
}
