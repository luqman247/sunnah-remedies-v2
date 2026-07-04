/**
 * Phase 9 — Course Notes Service
 */

import { communityDb, schema } from "@/db";
import { eq, and, desc } from "drizzle-orm";

export async function getCourseNotes(
  accountId: string,
  courseRef?: string
) {
  const conditions = [eq(schema.courseNotes.accountId, accountId)];
  if (courseRef) {
    conditions.push(eq(schema.courseNotes.courseRef, courseRef));
  }

  return communityDb
    .select()
    .from(schema.courseNotes)
    .where(and(...conditions))
    .orderBy(desc(schema.courseNotes.updatedAt));
}

export async function saveCourseNote(input: {
  accountId: string;
  courseRef: string;
  lessonRef?: string;
  body: string;
  noteId?: string;
}) {
  if (input.noteId) {
    await communityDb
      .update(schema.courseNotes)
      .set({ body: input.body, updatedAt: new Date() })
      .where(eq(schema.courseNotes.id, input.noteId));
    return input.noteId;
  }

  const result = await communityDb
    .insert(schema.courseNotes)
    .values({
      accountId: input.accountId,
      courseRef: input.courseRef,
      lessonRef: input.lessonRef,
      body: input.body,
    })
    .returning({ id: schema.courseNotes.id });

  return result[0].id;
}
