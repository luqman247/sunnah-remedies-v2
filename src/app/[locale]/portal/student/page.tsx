import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { ListingRow } from "@/components/ui/Attestation";
import { Link } from "@/i18n/navigation";
import { studentPortal } from "@/lib/navigation/student-portal";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { getStudentDashboard } from "@/modules/student/dashboard";

export const metadata: Metadata = {
  title: "Digital Campus",
  description: "Your scholarly workspace during study",
};

export default async function StudentDashboardPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal();
  const dashboard = await getStudentDashboard(session.accountId, locale);

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Digital Campus"
            folio="i"
            title="Your campus"
            lede="Current courses, next lesson, and institutional announcements"
          >
            <p>
              On graduation you become part of the alumni network — this campus
              is the beginning of a lifelong relationship with the institution
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <div className="section-page__layout">
            <aside className="section-page__nav">
              <DepartmentNav department={studentPortal} currentHref="/portal/student" />
            </aside>
            <div className="section-page__body">
              {dashboard.privateStreak > 0 && (
                <p className="type-micro" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
                  Private encouragement: {dashboard.privateStreak} day
                  {dashboard.privateStreak === 1 ? "" : "s"} of learning this month
                </p>
              )}

              {dashboard.announcements.length > 0 && (
                <section className="policy-block">
                  <h2 className="type-title">Announcements</h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {dashboard.announcements.map((a) => (
                      <li key={a._id} className="type-body" style={{ marginBottom: "var(--s3)" }}>
                        {a.message}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="policy-block">
                <h2 className="type-title">Current courses</h2>
                {dashboard.enrolments.length === 0 ? (
                  <>
                    <p className="type-body">You are not enrolled on a course yet</p>
                    <Link href="/portal/student/courses" className="go-link">
                      Browse courses
                      <span aria-hidden="true">→</span>
                    </Link>
                  </>
                ) : (
                  dashboard.enrolments.map(({ enrolment, course, nextLesson }) => (
                    <article key={enrolment.id} style={{ marginBottom: "var(--s5)" }}>
                      <ListingRow
                        title={enrolment.courseName}
                        provenance={`${enrolment.progressPct}% complete`}
                        href={`/portal/student/courses/${enrolment.courseSlug}`}
                      />
                      {nextLesson && course && (
                        <p className="type-small" style={{ marginTop: "var(--s2)" }}>
                          Next:{" "}
                          <Link
                            href={`/portal/student/courses/${course.slug}/lessons/${nextLesson.slug}`}
                            className="quiet-link"
                          >
                            {nextLesson.title}
                          </Link>
                        </p>
                      )}
                    </article>
                  ))
                )}
              </section>

              {dashboard.dueFlashcards > 0 && (
                <section className="policy-block">
                  <h2 className="type-title">Revision due</h2>
                  <p className="type-body">
                    {dashboard.dueFlashcards} flashcard
                    {dashboard.dueFlashcards === 1 ? "" : "s"} ready for review
                  </p>
                  <Link href="/portal/student/revision" className="go-link">
                    Open revision
                    <span aria-hidden="true">→</span>
                  </Link>
                </section>
              )}
            </div>
          </div>
        </div>
      </Leaf>
    </>
  );
}
