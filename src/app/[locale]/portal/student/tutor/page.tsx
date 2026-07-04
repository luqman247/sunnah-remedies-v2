import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { InstitutionalAssistant } from "@/components/ai/InstitutionalAssistant";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { memberHasCapability } from "@/lib/auth/member-session";
import { getEnrolments } from "@/modules/student/enrolments";

export const metadata: Metadata = {
  title: "AI Tutor",
};

export default async function TutorPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal("/portal/student/tutor");
  const canUseTutor = await memberHasCapability(session.accountId, "campus.ai_tutor");
  const enrolments = await getEnrolments(session.accountId);
  const activeCourse = enrolments[0];

  return (
    <StudentSectionPage
      folio="v"
      title="AI Tutor"
      lede="Course-context guidance grounded in verified institutional material"
      currentHref="/portal/student/tutor"
      breadcrumbLabel="AI Tutor"
      intro={
        <p>
          The tutor cites institutional sources and escalates clinical, dosing,
          and religious ruling questions to faculty — it does not improvise authority
        </p>
      }
    >
      {!canUseTutor ? (
        <p className="type-body">AI Tutor access requires active course enrolment</p>
      ) : (
        <InstitutionalAssistant
          surface="course"
          courseId={activeCourse?.courseRef}
          placeholder="Ask about your course material"
          language={locale}
        />
      )}
    </StudentSectionPage>
  );
}
