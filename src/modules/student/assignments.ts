/**
 * Phase 9 — Campus Assignments Service
 */

import { communityDb, schema } from "@/db";
import { eq, and, desc } from "drizzle-orm";

export async function getAssignmentsForCourse(courseRef: string) {
  return communityDb
    .select()
    .from(schema.campusAssignments)
    .where(eq(schema.campusAssignments.courseRef, courseRef))
    .orderBy(desc(schema.campusAssignments.dueAt));
}

export async function getSubmissionsForAccount(accountId: string) {
  return communityDb
    .select({
      submission: schema.campusSubmissions,
      assignment: schema.campusAssignments,
    })
    .from(schema.campusSubmissions)
    .innerJoin(
      schema.campusAssignments,
      eq(schema.campusSubmissions.assignmentId, schema.campusAssignments.id)
    )
    .where(eq(schema.campusSubmissions.accountId, accountId))
    .orderBy(desc(schema.campusSubmissions.submittedAt));
}

export async function submitAssignment(input: {
  assignmentId: string;
  accountId: string;
  body: string;
  attachments?: string[];
}) {
  const result = await communityDb
    .insert(schema.campusSubmissions)
    .values({
      assignmentId: input.assignmentId,
      accountId: input.accountId,
      body: input.body,
      attachments: input.attachments ?? [],
    })
    .returning({ id: schema.campusSubmissions.id });

  return result[0].id;
}

export async function seedDefaultAssignments(courseRef: string) {
  const existing = await getAssignmentsForCourse(courseRef);
  if (existing.length > 0) return;

  await communityDb.insert(schema.campusAssignments).values([
    {
      courseRef,
      title: "Graded source examination",
      prompt:
        "Cite three graded Prophetic reports on ḥijāma with full isnād notation per institutional standard",
      dueAt: new Date(Date.now() + 14 * 86400000),
    },
    {
      courseRef,
      title: "Clinical log review",
      prompt:
        "Submit your first ten supervised session logs with consent references and infection control checklist",
      dueAt: new Date(Date.now() + 28 * 86400000),
    },
  ]);
}
