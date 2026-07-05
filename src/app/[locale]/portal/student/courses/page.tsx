import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { ListingRow } from "@/components/ui/Attestation";
import { Link } from "@/i18n/navigation";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { getCampusCourses } from "@/sanity/lib/campus-fetch";
import { getEnrolments } from "@/modules/student/enrolments";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.student.courses", "/portal/student/courses");
}

export default async function StudentCoursesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal("/portal/student/courses");
  const [courses, enrolments] = await Promise.all([
    getCampusCourses(locale),
    getEnrolments(session.accountId),
  ]);

  const enrolledRefs = new Set(enrolments.map((e) => e.courseRef));

  return (
    <StudentSectionPage
      folio="ii"
      title="My courses"
      lede="Enrolled programmes and available campus courses"
      currentHref="/portal/student/courses"
      breadcrumbLabel="My courses"
    >
      {enrolments.length > 0 && (
        <section className="policy-block">
          <h2 className="type-title">Enrolled</h2>
          {enrolments.map((e) => (
            <ListingRow
              key={e.id}
              title={e.courseName}
              provenance={`${e.progressPct}% · ${e.status}`}
              href={`/portal/student/courses/${e.courseSlug}`}
            />
          ))}
        </section>
      )}

      <section className="policy-block">
        <h2 className="type-title">Available courses</h2>
        {courses.map((c) => (
          <article key={c.ref} style={{ marginBottom: "var(--s4)" }}>
            <ListingRow
              title={c.name}
              provenance={`${c.lessons.length} modules`}
              href={`/portal/student/courses/${c.slug}`}
              subtitle={c.subtitle}
            />
            {!enrolledRefs.has(c.ref) && (
              <p className="type-small" style={{ marginTop: "var(--s2)" }}>
                <Link href={`/portal/student/courses/${c.slug}`} className="quiet-link">
                  View course to enrol
                </Link>
              </p>
            )}
          </article>
        ))}
      </section>
    </StudentSectionPage>
  );
}
