/**
 * Phase 9 — Campus Enrolment Service
 */

import { communityDb, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { onEnrolment } from "@/modules/membership/lifecycle";
import { writeCommunityAuditLog } from "@/lib/audit/community";

export interface EnrolStudentInput {
  accountId: string;
  courseRef: string;
  courseSlug: string;
  courseName: string;
}

export async function enrolStudent(input: EnrolStudentInput): Promise<string> {
  const existing = await communityDb
    .select()
    .from(schema.campusEnrolments)
    .where(
      and(
        eq(schema.campusEnrolments.accountId, input.accountId),
        eq(schema.campusEnrolments.courseRef, input.courseRef)
      )
    )
    .limit(1);

  if (existing[0]) return existing[0].id;

  const result = await communityDb
    .insert(schema.campusEnrolments)
    .values({
      accountId: input.accountId,
      courseRef: input.courseRef,
      courseSlug: input.courseSlug,
      courseName: input.courseName,
      status: "active",
      progressPct: 0,
    })
    .returning({ id: schema.campusEnrolments.id });

  await onEnrolment(input.accountId);

  await writeCommunityAuditLog({
    actorAccountId: input.accountId,
    action: "campus.enrolled",
    target: "campus_enrolment",
    targetId: result[0].id,
    after: { courseSlug: input.courseSlug },
  });

  return result[0].id;
}

export async function getEnrolments(accountId: string) {
  return communityDb
    .select()
    .from(schema.campusEnrolments)
    .where(eq(schema.campusEnrolments.accountId, accountId));
}

export async function getEnrolment(
  accountId: string,
  courseRef: string
) {
  const rows = await communityDb
    .select()
    .from(schema.campusEnrolments)
    .where(
      and(
        eq(schema.campusEnrolments.accountId, accountId),
        eq(schema.campusEnrolments.courseRef, courseRef)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function getEnrolmentBySlug(
  accountId: string,
  courseSlug: string
) {
  const rows = await communityDb
    .select()
    .from(schema.campusEnrolments)
    .where(
      and(
        eq(schema.campusEnrolments.accountId, accountId),
        eq(schema.campusEnrolments.courseSlug, courseSlug)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

async function recomputeProgress(enrolmentId: string, totalLessons: number) {
  const progress = await communityDb
    .select()
    .from(schema.lessonProgress)
    .where(eq(schema.lessonProgress.enrolmentId, enrolmentId));

  const completed = progress.filter((p) => p.completedAt).length;
  const pct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

  await communityDb
    .update(schema.campusEnrolments)
    .set({ progressPct: pct, updatedAt: new Date() })
    .where(eq(schema.campusEnrolments.id, enrolmentId));

  return pct;
}

export { recomputeProgress };
