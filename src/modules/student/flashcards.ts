/**
 * Phase 9 — Flashcards Service (spaced repetition)
 */

import { communityDb, schema } from "@/db";
import { eq, and, lte } from "drizzle-orm";

export async function getFlashcards(accountId: string, courseRef?: string) {
  const conditions = [eq(schema.flashcardDecks.accountId, accountId)];
  if (courseRef) {
    conditions.push(eq(schema.flashcardDecks.courseRef, courseRef));
  }

  return communityDb
    .select()
    .from(schema.flashcardDecks)
    .where(and(...conditions));
}

export async function getDueFlashcards(accountId: string) {
  const now = new Date();
  const reviews = await communityDb
    .select({
      deck: schema.flashcardDecks,
      review: schema.flashcardReviews,
    })
    .from(schema.flashcardReviews)
    .innerJoin(
      schema.flashcardDecks,
      eq(schema.flashcardReviews.deckId, schema.flashcardDecks.id)
    )
    .where(
      and(
        eq(schema.flashcardReviews.accountId, accountId),
        lte(schema.flashcardReviews.dueAt, now)
      )
    );

  return reviews;
}

export async function createFlashcard(input: {
  accountId: string;
  courseRef: string;
  lessonRef?: string;
  front: string;
  back: string;
}) {
  const deck = await communityDb
    .insert(schema.flashcardDecks)
    .values(input)
    .returning({ id: schema.flashcardDecks.id });

  await communityDb.insert(schema.flashcardReviews).values({
    deckId: deck[0].id,
    accountId: input.accountId,
    dueAt: new Date(),
  });

  return deck[0].id;
}

/** SM-2 simplified: quality 0-5 */
export async function reviewFlashcard(
  deckId: string,
  accountId: string,
  quality: number
) {
  const rows = await communityDb
    .select()
    .from(schema.flashcardReviews)
    .where(
      and(
        eq(schema.flashcardReviews.deckId, deckId),
        eq(schema.flashcardReviews.accountId, accountId)
      )
    )
    .limit(1);

  const review = rows[0];
  if (!review) return;

  let { easeFactor, interval } = review;

  if (quality < 3) {
    interval = 1;
  } else {
    if (review.lastReviewedAt) {
      interval = Math.round(interval * (easeFactor / 250));
    } else {
      interval = 1;
    }
    easeFactor = Math.max(
      130,
      easeFactor + Math.round((5 - quality) * 10 - (5 - quality) * (5 - quality) * 2)
    );
  }

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + interval);

  await communityDb
    .update(schema.flashcardReviews)
    .set({
      easeFactor,
      interval,
      dueAt,
      lastReviewedAt: new Date(),
    })
    .where(eq(schema.flashcardReviews.id, review.id));
}

export async function seedFlashcardsFromCourse(
  accountId: string,
  courseRef: string,
  cards: Array<{ front: string; back: string; lessonRef?: string }>
) {
  for (const card of cards) {
    await createFlashcard({
      accountId,
      courseRef,
      lessonRef: card.lessonRef,
      front: card.front,
      back: card.back,
    });
  }
}
