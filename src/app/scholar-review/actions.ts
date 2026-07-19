"use server";

/**
 * "Scholar Review" portal — server actions. Every action is a Next.js
 * Server Action (POST-only, origin-checked by the framework — CSRF-safe by
 * construction) and calls assertStagingDataset() indirectly via
 * staging-client.ts before any Sanity read/write.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  verifyAccessCodeInput,
  grantAccess,
  revokeAccess,
  setSessionCookie,
  getSessionIdFromCookie,
  checkAttemptLimit,
  recordFailedAttempt,
} from "@/lib/scholar-review/access-control";
import { createReviewSession, touchReviewSession, submitProgramme } from "@/lib/scholar-review/review-records";
import {
  saveDuaDhikrEntryReview,
  type DuaDhikrEntryReviewInput,
  saveDuaDhikrCollectionReview,
  type DuaDhikrCollectionReviewInput,
  saveFeelingStateReview,
  type FeelingStateReviewInput,
} from "@/lib/scholar-review/review-records";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function submitAccessCodeAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const { allowed } = await checkAttemptLimit();
  if (!allowed) {
    return { ok: false, error: "Too many incorrect attempts. Please wait 15 minutes and try again." };
  }
  const input = String(formData.get("accessCode") ?? "");
  if (!input.trim()) return { ok: false, error: "Enter the access code." };
  if (!verifyAccessCodeInput(input)) {
    await recordFailedAttempt();
    return { ok: false, error: "That code isn't correct." };
  }
  await grantAccess();
  revalidatePath("/scholar-review");
  return { ok: true };
}

export async function submitReviewerIdentityAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const roleOrQualification = String(formData.get("roleOrQualification") ?? "").trim();
  const organisation = String(formData.get("organisation") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!fullName) return { ok: false, error: "Enter your full name." };
  if (!roleOrQualification) return { ok: false, error: "Enter your role or qualification." };

  const sessionId = await createReviewSession({
    fullName,
    roleOrQualification,
    organisation: organisation || undefined,
    email: email || undefined,
  });
  await setSessionCookie(sessionId);
  revalidatePath("/scholar-review");
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await revokeAccess();
  redirect("/scholar-review");
}

async function requireSessionId(): Promise<string> {
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) throw new Error("No active review session.");
  await touchReviewSession(sessionId);
  return sessionId;
}

export async function saveDuaDhikrEntryReviewAction(entryId: string, input: DuaDhikrEntryReviewInput, completed = false): Promise<ActionResult> {
  try {
    const sessionId = await requireSessionId();
    await saveDuaDhikrEntryReview(sessionId, entryId, input, completed);
    revalidatePath(`/scholar-review/dua-dhikr/${entryId}`);
    revalidatePath("/scholar-review/dua-dhikr");
    revalidatePath("/scholar-review");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Save failed." };
  }
}

export async function saveDuaDhikrCollectionReviewAction(collectionId: string, input: DuaDhikrCollectionReviewInput, completed = false): Promise<ActionResult> {
  try {
    const sessionId = await requireSessionId();
    await saveDuaDhikrCollectionReview(sessionId, collectionId, input, completed);
    revalidatePath(`/scholar-review/dua-dhikr/collections/${collectionId}`);
    revalidatePath("/scholar-review/dua-dhikr/collections");
    revalidatePath("/scholar-review");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Save failed." };
  }
}

export async function saveFeelingStateReviewAction(feelingStateDocId: string, input: FeelingStateReviewInput, completed = false): Promise<ActionResult> {
  try {
    const sessionId = await requireSessionId();
    await saveFeelingStateReview(sessionId, feelingStateDocId, input, completed);
    revalidatePath("/scholar-review/i-am-feeling");
    revalidatePath("/scholar-review");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Save failed." };
  }
}

export async function submitProgrammeAction(programme: "dua-dhikr" | "feeling"): Promise<ActionResult> {
  try {
    const sessionId = await requireSessionId();
    await submitProgramme(sessionId, programme);
    revalidatePath("/scholar-review");
    revalidatePath("/scholar-review/summary");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Submission failed." };
  }
}
