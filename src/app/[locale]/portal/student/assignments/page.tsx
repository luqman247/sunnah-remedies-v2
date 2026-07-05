import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { getEnrolments } from "@/modules/student/enrolments";
import { getAssignmentsForCourse, getSubmissionsForAccount } from "@/modules/student/assignments";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.student.assignments", "/portal/student/assignments");
}

export default async function AssignmentsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal("/portal/student/assignments");
  const enrolments = await getEnrolments(session.accountId);
  const submissions = await getSubmissionsForAccount(session.accountId);

  const assignments = [];
  for (const e of enrolments) {
    const courseAssignments = await getAssignmentsForCourse(e.courseRef);
    assignments.push(...courseAssignments.map((a) => ({ ...a, courseName: e.courseName })));
  }

  return (
    <StudentSectionPage
      folio="iv"
      title="Assignments"
      lede="Submissions, faculty feedback, and published due dates"
      currentHref="/portal/student/assignments"
      breadcrumbLabel="Assignments"
    >
      {assignments.length === 0 ? (
        <p className="type-body">No assignments for your enrolled courses</p>
      ) : (
        assignments.map((a) => {
          const submission = submissions.find(
            (s) => s.assignment.id === a.id
          );
          return (
            <article key={a.id} className="policy-block">
              <h2 className="type-title">{a.title}</h2>
              <p className="type-micro" style={{ color: "var(--muted)" }}>
                {a.courseName}
                {a.dueAt && ` · Due ${new Date(a.dueAt).toLocaleDateString(locale)}`}
              </p>
              <p className="type-body">{a.prompt}</p>
              {submission ? (
                <>
                  <p className="type-small" style={{ marginTop: "var(--s3)" }}>
                    Submitted {new Date(submission.submission.submittedAt).toLocaleDateString(locale)}
                  </p>
                  {submission.submission.grade && (
                    <p className="type-body">Grade: {submission.submission.grade}</p>
                  )}
                  {submission.submission.feedback && (
                    <p className="type-body">{submission.submission.feedback}</p>
                  )}
                </>
              ) : (
                <p className="type-micro" style={{ color: "var(--muted)", marginTop: "var(--s3)" }}>
                  Not yet submitted — contact faculty for submission instructions
                </p>
              )}
            </article>
          );
        })
      )}
    </StudentSectionPage>
  );
}
