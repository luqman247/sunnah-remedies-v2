import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { ListingRow } from "@/components/ui/Attestation";
import { EnrolButton } from "@/components/portal/EnrolButton";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { getCampusCourseBySlug } from "@/sanity/lib/campus-fetch";
import { getEnrolmentBySlug } from "@/modules/student/enrolments";
import { getLessonProgress } from "@/modules/student/progress";
import { seedDefaultAssignments } from "@/modules/student/assignments";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = await getCampusCourseBySlug(slug, locale);
  return { title: course?.name ?? "Course" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal(`/portal/student/courses/${slug}`);
  const course = await getCampusCourseBySlug(slug, locale);
  if (!course) notFound();

  await seedDefaultAssignments(course.ref);

  const enrolment = await getEnrolmentBySlug(session.accountId, slug);
  const progress = enrolment ? await getLessonProgress(enrolment.id) : [];
  const completedRefs = new Set(
    progress.filter((p) => p.completedAt).map((p) => p.lessonRef)
  );

  return (
    <StudentSectionPage
      folio="ii"
      title={course.name}
      lede={course.subtitle}
      currentHref="/portal/student/courses"
      breadcrumbLabel={course.name}
      breadcrumbItems={[
        { label: "Digital Campus", href: "/portal/student" },
        { label: "My courses", href: "/portal/student/courses" },
        { label: course.name },
      ]}
      intro={
        enrolment ? (
          <p className="type-micro" style={{ color: "var(--muted)" }}>
            {enrolment.progressPct}% complete · {enrolment.status}
          </p>
        ) : (
          <EnrolButton
            courseRef={course.ref}
            courseSlug={course.slug}
            courseName={course.name}
          />
        )
      }
    >
      <section className="policy-block">
        <h2 className="type-title">Modules</h2>
        {course.lessons.map((lesson) => (
          <ListingRow
            key={lesson.ref}
            title={`Module ${lesson.moduleNumber}: ${lesson.title}`}
            provenance={
              completedRefs.has(lesson.ref) ? "Complete" : "Not started"
            }
            href={
              enrolment
                ? `/portal/student/courses/${slug}/lessons/${lesson.slug}`
                : "#"
            }
            subtitle={lesson.description.slice(0, 120)}
          />
        ))}
      </section>

      {course.readingList.length > 0 && (
        <section className="policy-block">
          <h2 className="type-title">Reading list</h2>
          <ul className="type-body">
            {course.readingList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </StudentSectionPage>
  );
}
