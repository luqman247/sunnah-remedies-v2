import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { PortableBody } from "@/components/editorial/PortableBody";
import { EditorialVideo } from "@/components/media/EditorialVideo";
import { InstitutionalAssistant } from "@/components/ai/InstitutionalAssistant";
import { LessonCompleteButton } from "@/components/portal/LessonCompleteButton";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { getCampusCourseBySlug, getCampusLesson } from "@/sanity/lib/campus-fetch";
import { getEnrolmentBySlug } from "@/modules/student/enrolments";
import { getLessonProgress } from "@/modules/student/progress";
import { memberHasCapability } from "@/lib/auth/member-session";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string; lessonSlug: string }>;
}): Promise<Metadata> {
  const { locale, slug, lessonSlug } = await params;
  const lesson = await getCampusLesson(slug, lessonSlug, locale);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string; lessonSlug: string }>;
}) {
  const { locale, slug, lessonSlug } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal(
    `/portal/student/courses/${slug}/lessons/${lessonSlug}`
  );

  const [course, lesson, enrolment] = await Promise.all([
    getCampusCourseBySlug(slug, locale),
    getCampusLesson(slug, lessonSlug, locale),
    getEnrolmentBySlug(session.accountId, slug),
  ]);

  if (!course || !lesson) notFound();
  if (!enrolment) notFound();

  const progress = await getLessonProgress(enrolment.id);
  const lessonProgress = progress.find((p) => p.lessonRef === lesson.ref);
  const canUseTutor = await memberHasCapability(session.accountId, "campus.ai_tutor");

  return (
    <StudentSectionPage
      folio="ii"
      title={lesson.title}
      lede={lesson.description}
      currentHref="/portal/student/courses"
      breadcrumbLabel={lesson.title}
      breadcrumbItems={[
        { label: "Digital Campus", href: "/portal/student" },
        { label: course.name, href: `/portal/student/courses/${slug}` },
        { label: lesson.title },
      ]}
    >
      {lesson.videoPublicId && (
        <div style={{ marginBottom: "var(--s6)" }}>
          <EditorialVideo
            publicId={lesson.videoPublicId}
            mode="player"
            poster={{ alt: lesson.title }}
            caption={lesson.title}
          />
        </div>
      )}

      {lesson.body && Array.isArray(lesson.body) ? (
        <PortableBody value={lesson.body} />
      ) : (
        <p className="type-body">{lesson.description}</p>
      )}

      {("practical" in lesson && lesson.practical) ? (
        <section className="policy-block">
          <h2 className="type-title">Practical work</h2>
          <p className="type-body">{String(lesson.practical)}</p>
        </section>
      ) : null}

      {lesson.readingList && lesson.readingList.length > 0 && (
        <section className="policy-block">
          <h2 className="type-title">Reading</h2>
          <ul className="type-body">
            {lesson.readingList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {lesson.downloads && lesson.downloads.length > 0 && (
        <section className="policy-block">
          <h2 className="type-title">Downloads</h2>
          <ul className="type-body">
            {lesson.downloads.map((d, i) => (
              <li key={i}>
                {d.url ? (
                  <a href={d.url} className="quiet-link">
                    {d.fileName ?? "Download"}
                  </a>
                ) : (
                  d.fileName
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div style={{ marginTop: "var(--s6)" }}>
        <LessonCompleteButton
          enrolmentId={enrolment.id}
          lessonRef={lesson.ref}
          lessonSlug={lesson.slug}
          totalLessons={course.lessons.length}
          initiallyCompleted={!!lessonProgress?.completedAt}
        />
      </div>

      {canUseTutor && (
        <section className="policy-block" style={{ marginTop: "var(--s6)" }}>
          <h2 className="type-title">AI Tutor</h2>
          <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
            Grounded in institutional course material. Clinical and religious
            questions are escalated to faculty
          </p>
          <InstitutionalAssistant
            surface="course"
            courseId={course.ref}
            lectureId={lesson.ref}
            placeholder="Ask about this module"
            language={locale}
          />
        </section>
      )}
    </StudentSectionPage>
  );
}
