/**
 * Phase 9 — Lesson Progress Service
 */

import { communityDb, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { recomputeProgress } from "@/modules/student/enrolments";

export interface UpdateProgressInput {
  enrolmentId: string;
  lessonRef: string;
  lessonSlug: string;
  secondsWatched?: number;
  lastPosition?: number;
  completed?: boolean;
  totalLessons?: number;
}

export async function updateLessonProgress(input: UpdateProgressInput) {
  const existing = await communityDb
    .select()
    .from(schema.lessonProgress)
    .where(
      and(
        eq(schema.lessonProgress.enrolmentId, input.enrolmentId),
        eq(schema.lessonProgress.lessonRef, input.lessonRef)
      )
    )
    .limit(1);

  const values = {
    secondsWatched: input.secondsWatched,
    lastPosition: input.lastPosition,
    completedAt: input.completed ? new Date() : undefined,
    updatedAt: new Date(),
  };

  if (existing[0]) {
    await communityDb
      .update(schema.lessonProgress)
      .set({
        ...values,
        completedAt: input.completed
          ? existing[0].completedAt ?? new Date()
          : existing[0].completedAt,
      })
      .where(eq(schema.lessonProgress.id, existing[0].id));
  } else {
    await communityDb.insert(schema.lessonProgress).values({
      enrolmentId: input.enrolmentId,
      lessonRef: input.lessonRef,
      lessonSlug: input.lessonSlug,
      secondsWatched: input.secondsWatched ?? 0,
      lastPosition: input.lastPosition ?? 0,
      completedAt: input.completed ? new Date() : null,
    });
  }

  if (input.totalLessons && input.completed) {
    await recomputeProgress(input.enrolmentId, input.totalLessons);
  }
}

export async function getLessonProgress(enrolmentId: string) {
  return communityDb
    .select()
    .from(schema.lessonProgress)
    .where(eq(schema.lessonProgress.enrolmentId, enrolmentId));
}

export async function computePrivateStreak(accountId: string): Promise<number> {
  const enrolments = await communityDb
    .select()
    .from(schema.campusEnrolments)
    .where(eq(schema.campusEnrolments.accountId, accountId));

  if (!enrolments.length) return 0;

  const allDates = new Set<string>();

  for (const enrolment of enrolments) {
    const progress = await getLessonProgress(enrolment.id);
    for (const p of progress) {
      const date = p.completedAt ?? p.updatedAt;
      if (date) {
        allDates.add(date.toISOString().slice(0, 10));
      }
    }
  }

  if (allDates.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (allDates.has(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

export async function getNextLesson(
  enrolmentId: string,
  lessons: Array<{ ref: string; slug: string; title: string; order: number }>
) {
  const progress = await getLessonProgress(enrolmentId);
  const completedRefs = new Set(
    progress.filter((p) => p.completedAt).map((p) => p.lessonRef)
  );

  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  return sorted.find((l) => !completedRefs.has(l.ref)) ?? null;
}
