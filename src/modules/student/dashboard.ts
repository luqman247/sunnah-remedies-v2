/**
 * Phase 9 — Student Dashboard Service
 */

import { getEnrolments } from "@/modules/student/enrolments";
import {
  getLessonProgress,
  computePrivateStreak,
  getNextLesson,
} from "@/modules/student/progress";
import { getDueFlashcards } from "@/modules/student/flashcards";
import { getSubmissionsForAccount } from "@/modules/student/assignments";
import { getCertificates } from "@/modules/practitioner/credentials";
import { getSavedResources } from "@/modules/practitioner/resources";
import {
  getCampusCourses,
  getStudentAnnouncements,
} from "@/sanity/lib/campus-fetch";
import { getCampusCourseBySlug } from "@/sanity/lib/campus-fetch";

export async function getStudentDashboard(
  accountId: string,
  locale: string
) {
  const [enrolments, streak, dueCards, submissions, certificates, saved, announcements] =
    await Promise.all([
      getEnrolments(accountId),
      computePrivateStreak(accountId),
      getDueFlashcards(accountId),
      getSubmissionsForAccount(accountId),
      getCertificates(accountId),
      getSavedResources(accountId),
      getStudentAnnouncements(),
    ]);

  const courses = await getCampusCourses(locale);

  const enrolledWithProgress = await Promise.all(
    enrolments.map(async (e) => {
      const course = courses.find(
        (c) => c.ref === e.courseRef || c.slug === e.courseSlug
      ) ?? (await getCampusCourseBySlug(e.courseSlug, locale));

      const progress = await getLessonProgress(e.id);
      const nextLesson = course
        ? await getNextLesson(
            e.id,
            course.lessons.map((l) => ({
              ref: l.ref,
              slug: l.slug,
              title: l.title,
              order: l.order,
            }))
          )
        : null;

      return { enrolment: e, course, progress, nextLesson };
    })
  );

  return {
    enrolments: enrolledWithProgress,
    privateStreak: streak,
    dueFlashcards: dueCards.length,
    submissions,
    certificates,
    savedCount: saved.length,
    announcements: announcements.slice(0, 5),
    availableCourses: courses,
  };
}
