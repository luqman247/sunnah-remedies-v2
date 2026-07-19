/**
 * Governance validation rules for Sanity documents.
 *
 * These functions return Sanity custom validation callbacks suitable for
 * use with the `validation: (rule) => rule.custom(...)` pattern.
 *
 * @see Phase 4, Chapter 12.3 — Approval matrix
 * @see Phase 4, Chapter 12.4 — The slow lane
 * @see Phase 4, Chapter 09.2 — Editorial desk SOP (provenance required)
 */

import { hasApprovedDhikrBoard } from "@/sanity/lib/dhikr-publication-gate";
import { hasApprovedFeelingBoard } from "@/sanity/lib/feeling-publication-gate";

interface SlugUniquenessContext {
  document?: { _id?: string; _type?: string };
  getClient: (options: { apiVersion: string }) => {
    fetch: (query: string, params: Record<string, unknown>) => Promise<boolean | null>;
  };
}

/**
 * Validates that a value exists when the document's editorial status is "published".
 * Used for fields that must be filled before publishing.
 */
export function requiredWhenPublished(message: string) {
  return (value: unknown, context: { document?: Record<string, unknown> }) => {
    const editorial = context.document?.editorial as { status?: string } | undefined;
    if (editorial?.status === "published" && !value) {
      return message;
    }
    return true;
  };
}

/**
 * Validates that a slow-lane hold has a reason provided.
 */
export function requiredWhenSlowLane(value: unknown, context: { parent?: unknown }) {
  const parent = context.parent as Record<string, unknown> | undefined;
  if (parent?.status === "slow-lane" && (!value || (typeof value === "string" && value.trim() === ""))) {
    return "A reason is required when holding content in the slow lane.";
  }
  return true;
}

/**
 * Validates that a Dhikr item field is populated before its reviewStatus can
 * be "published". Mirrors the mandatory-field arm of the canonical rule in
 * src/sanity/lib/dhikr-publication-gate.ts — if that rule changes, this must
 * change too.
 *
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 */
export function requiredWhenDhikrPublished(message: string) {
  return (value: unknown, context: { document?: Record<string, unknown> }) => {
    const reviewStatus = context.document?.reviewStatus as string | undefined;
    if (reviewStatus === "published" && !value) {
      return message;
    }
    return true;
  };
}

/**
 * Validates that a Dhikr item has at least one source reference before its
 * reviewStatus can be "published".
 *
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 */
export function requiredDhikrSourceReferences(value: unknown, context: { document?: Record<string, unknown> }) {
  const reviewStatus = context.document?.reviewStatus as string | undefined;
  if (reviewStatus === "published" && (!Array.isArray(value) || value.length === 0)) {
    return "At least one source reference is required before publishing.";
  }
  return true;
}

/**
 * Validates that both the required scholarly and required editorial board
 * approvals are present and approved before a Dhikr item's reviewStatus can
 * be "published". A single board approval of either kind is not sufficient —
 * both roles must independently sign off (see docs/dhikr/03: the editorial
 * reviewer cannot approve on authenticity grounds, and the scholarly reviewer
 * is not a substitute for the editorial/presentation pass).
 *
 * Reuses hasApprovedDhikrBoard from dhikr-publication-gate.ts so this check
 * cannot drift out of sync with the canonical eligibility rule.
 *
 * @see src/sanity/lib/dhikr-publication-gate.ts
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 * @see docs/dhikr/20-risk-register.md (R-01)
 */
export function requiredDhikrBoardApprovals(value: unknown, context: { document?: Record<string, unknown> }) {
  const reviewStatus = context.document?.reviewStatus as string | undefined;
  if (reviewStatus !== "published") return true;

  const approvals = Array.isArray(value) ? (value as { board?: string; approved?: boolean }[]) : [];
  const hasScholarly = hasApprovedDhikrBoard(approvals, "scholarly");
  const hasEditorial = hasApprovedDhikrBoard(approvals, "editorial");

  if (!hasScholarly && !hasEditorial) {
    return "Both scholarly and editorial board approval are required before publishing.";
  }
  if (!hasScholarly) {
    return "Scholarly Review Board approval is required before publishing.";
  }
  if (!hasEditorial) {
    return "Editorial approval is required before publishing.";
  }
  return true;
}

/**
 * Slug uniqueness check for Dhikr documents (dhikrItem, dhikrCategory).
 *
 * This repository's other `type: "slug"` fields (see reference-entities.ts,
 * knowledge-entities.ts, article.ts, etc.) rely on Sanity Studio's default
 * per-type uniqueness check and do not set `options.isUnique` explicitly.
 * That default is a Studio-UI convenience, not a hard, queryable guarantee.
 * Dhikr slugs are deliberately stricter: this is passed as
 * `options.isUnique` on the slug field so a duplicate slug cannot be saved
 * for another document of the same `_type`, which would otherwise let two
 * documents silently resolve to the same public URL segment. Excludes both
 * the draft and published version of the document being edited from the
 * comparison, per Sanity's documented isUnique pattern.
 *
 * Deliberately independent of reviewStatus / the canonical publication gate
 * in dhikr-publication-gate.ts — a slug can be reserved before an item is
 * published, but two documents may never share one regardless of status.
 */
export async function isUniqueDhikrSlug(slug: string, context: SlugUniquenessContext): Promise<boolean> {
  const { document, getClient } = context;
  const id = document?._id?.replace(/^drafts\./, "") ?? "";
  const type = document?._type;
  if (!type || !id) return true;

  const client = getClient({ apiVersion: "2024-01-01" });
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    type,
  };
  const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
  const result = await client.fetch(query, params);
  return result !== false;
}

/**
 * Slug uniqueness check for "I am feeling…" documents (feelingFamily,
 * feelingState). Independent of, but structurally identical to,
 * isUniqueDhikrSlug above — kept separate deliberately, per the same
 * per-content-type independence rule dua-dhikr-publication-gate.ts already
 * documents.
 *
 * @see docs/i-am-feeling/SPEC.md
 */
export async function isUniqueFeelingSlug(slug: string, context: SlugUniquenessContext): Promise<boolean> {
  const { document, getClient } = context;
  const id = document?._id?.replace(/^drafts\./, "") ?? "";
  const type = document?._type;
  if (!type || !id) return true;

  const client = getClient({ apiVersion: "2024-01-01" });
  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
    type,
  };
  const query = `!defined(*[_type == $type && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;
  const result = await client.fetch(query, params);
  return result !== false;
}

/**
 * Validates that a value exists when a feelingState's reviewStatus is
 * "published". Mirrors requiredWhenDhikrPublished above but reads
 * feelingState's own reviewStatus field — kept as a separate function so a
 * future change to one gate never silently changes the other's behaviour.
 *
 * @see docs/i-am-feeling/SPEC.md §6
 */
export function requiredWhenFeelingPublished(message: string) {
  return (value: unknown, context: { document?: Record<string, unknown> }) => {
    const reviewStatus = context.document?.reviewStatus as string | undefined;
    if (reviewStatus === "published" && !value) {
      return message;
    }
    return true;
  };
}

/**
 * Validates that a feelingState's professionalSupportNoteEn/Da is present
 * before publishing, but ONLY when safeguardingLevel is not "standard" — a
 * standard-tone state is never blocked by a field it was never required to
 * fill in.
 *
 * @see docs/i-am-feeling/SPEC.md §6, §8
 */
export function requiredFeelingProfessionalSupportNote(
  value: unknown,
  context: { document?: Record<string, unknown> },
) {
  const reviewStatus = context.document?.reviewStatus as string | undefined;
  const safeguardingLevel = context.document?.safeguardingLevel as string | undefined;
  if (reviewStatus !== "published") return true;
  if (safeguardingLevel === "standard" || !safeguardingLevel) return true;
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return "A professional-support note is required before publishing a state with elevated safeguarding.";
  }
  return true;
}

/**
 * Validates that an approved "clinical" board approval is present before a
 * feelingState with safeguardingLevel "heightened" or "crisis-adjacent" can
 * publish. "crisis-adjacent" additionally requires an approved
 * "standards-council" approval. Reuses hasApprovedFeelingBoard from
 * feeling-publication-gate.ts so this Studio-side check cannot drift out of
 * sync with the canonical public-eligibility rule.
 *
 * @see src/sanity/lib/feeling-publication-gate.ts
 * @see docs/i-am-feeling/SPEC.md §6, §7.6
 */
export function requiredFeelingClinicalApproval(value: unknown, context: { document?: Record<string, unknown> }) {
  const reviewStatus = context.document?.reviewStatus as string | undefined;
  const safeguardingLevel = context.document?.safeguardingLevel as string | undefined;
  if (reviewStatus !== "published") return true;
  if (safeguardingLevel === "standard" || !safeguardingLevel) return true;

  const approvals = Array.isArray(value) ? (value as { board?: string; approved?: boolean }[]) : [];
  if (!hasApprovedFeelingBoard(approvals, "clinical")) {
    return "An approved clinical board approval is required before publishing a state with elevated safeguarding.";
  }
  if (safeguardingLevel === "crisis-adjacent" && !hasApprovedFeelingBoard(approvals, "standards-council")) {
    return "An approved standards-council board approval is required before publishing a crisis-adjacent state.";
  }
  return true;
}
