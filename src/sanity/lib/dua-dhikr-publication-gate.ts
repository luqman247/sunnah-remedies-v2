/**
 * Duʿa & Dhikr Publication Gate — single canonical eligibility rule for
 * `duaDhikrEntry` documents.
 *
 * Deliberately mirrors src/sanity/lib/dhikr-publication-gate.ts (the
 * Morning/Evening Dhikr gate) rather than importing from it, because the
 * two content types are independent: a change to one gate must never
 * silently change the other's behaviour. See docs/dua-dhikr/REVIEW_BYPASS.md
 * for the full explanation of both pathways below and exactly what the
 * "temporary scholarly-review bypass" does and does not do.
 *
 * "Publicly eligible" (canonical, scholarly-approved pathway) means all of:
 *   - reviewStatus is "published"
 *   - arabicText, translationEn, translationDa are present
 *   - at least one sourceReference is present
 *   - an approved "scholarly" board approval is recorded
 *   - an approved "editorial" board approval is recorded
 *
 * @see docs/dua-dhikr/CONTENT_MODEL.md
 * @see docs/dua-dhikr/REVIEW_BYPASS.md
 * @see docs/dua-dhikr/SOURCE_POLICY.md
 */

/**
 * Uses length(field) > 0 rather than defined(field) && field != "" — GROQ's
 * filter-stage defined() is unreliable for long text fields (confirmed:
 * consistently, reproducibly false for real, populated arabicText/
 * translationEn values over ~1000+ characters, e.g. full Qur'anic ayat,
 * even though the exact same field reads correctly via a projection or via
 * length()/string() in the same filter stage). length() reads the actual
 * document value and has shown no such failure.
 */
export const DUA_DHIKR_ELIGIBILITY_GROQ = `
  reviewStatus == "published"
  && length(arabicText) > 0
  && length(translationEn) > 0
  && length(translationDa) > 0
  && count(sourceReferences) > 0
  && count(boardApprovals[board == "scholarly" && approved == true]) > 0
  && count(boardApprovals[board == "editorial" && approved == true]) > 0
`.trim();

export interface DuaDhikrBoardApprovalLike {
  board?: string;
  approved?: boolean;
}

export interface DuaDhikrEntryEligibilityInput {
  reviewStatus?: string;
  arabicText?: string;
  translationEn?: string;
  translationDa?: string;
  sourceReferences?: unknown[];
  boardApprovals?: DuaDhikrBoardApprovalLike[];
}

export function hasApprovedDuaDhikrBoard(
  approvals: DuaDhikrBoardApprovalLike[] | undefined,
  board: "scholarly" | "editorial",
): boolean {
  return Array.isArray(approvals) && approvals.some((a) => a?.board === board && a?.approved === true);
}

export interface DuaDhikrEligibilityCondition {
  key:
    | "review-status-published"
    | "arabic-present"
    | "english-translation-present"
    | "danish-translation-present"
    | "valid-source-reference-present"
    | "scholarly-approval-present"
    | "editorial-approval-present";
  label: string;
  met: boolean;
}

export function getDuaDhikrEligibilityConditions(
  doc: DuaDhikrEntryEligibilityInput,
): DuaDhikrEligibilityCondition[] {
  return [
    { key: "review-status-published", label: 'reviewStatus is "published"', met: doc.reviewStatus === "published" },
    { key: "arabic-present", label: "Arabic text is present", met: !!doc.arabicText },
    { key: "english-translation-present", label: "English translation is present", met: !!doc.translationEn },
    { key: "danish-translation-present", label: "Danish translation is present", met: !!doc.translationDa },
    {
      key: "valid-source-reference-present",
      label: "At least one source reference is present",
      met: Array.isArray(doc.sourceReferences) && doc.sourceReferences.length > 0,
    },
    {
      key: "scholarly-approval-present",
      label: "An approved scholarly board approval is present",
      met: hasApprovedDuaDhikrBoard(doc.boardApprovals, "scholarly"),
    },
    {
      key: "editorial-approval-present",
      label: "An approved editorial board approval is present",
      met: hasApprovedDuaDhikrBoard(doc.boardApprovals, "editorial"),
    },
  ];
}

export function isDuaDhikrEntryPubliclyEligible(doc: DuaDhikrEntryEligibilityInput): boolean {
  return getDuaDhikrEligibilityConditions(doc).every((condition) => condition.met);
}

/**
 * Editorial-publication pathway — the temporary, reversible scholarly-review
 * bypass for THIS Duʿa & Dhikr expansion phase only (see docs/dua-dhikr/
 * REVIEW_BYPASS.md). A SEPARATE, additive rule from DUA_DHIKR_ELIGIBILITY_GROQ
 * above — never touches or weakens it. Requires only an EDITORIAL board
 * approval (never scholarly) plus editorialPublicationStatus explicitly set
 * by a human editorial reviewer. Any route surfacing content eligible only
 * through this rule MUST display a neutral "scholarly review pending" note —
 * never a claim of scholarly approval or "scholarly reviewed" status.
 */
// length(field) > 0, not defined(field) && field != "" — see the note on
// DUA_DHIKR_ELIGIBILITY_GROQ above for why.
export const DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ = `
  editorialPublicationStatus == "editorial-only-scholarly-review-pending"
  && length(arabicText) > 0
  && length(translationEn) > 0
  && length(translationDa) > 0
  && count(sourceReferences) > 0
  && count(boardApprovals[board == "editorial" && approved == true]) > 0
`.trim();

export interface DuaDhikrEntryEditorialEligibilityInput {
  editorialPublicationStatus?: string;
  arabicText?: string;
  translationEn?: string;
  translationDa?: string;
  sourceReferences?: unknown[];
  boardApprovals?: DuaDhikrBoardApprovalLike[];
}

export interface DuaDhikrEditorialEligibilityCondition {
  key:
    | "editorial-publication-status-set"
    | "arabic-present"
    | "english-translation-present"
    | "danish-translation-present"
    | "valid-source-reference-present"
    | "editorial-approval-present";
  label: string;
  met: boolean;
}

export function getDuaDhikrEditorialEligibilityConditions(
  doc: DuaDhikrEntryEditorialEligibilityInput,
): DuaDhikrEditorialEligibilityCondition[] {
  return [
    {
      key: "editorial-publication-status-set",
      label: 'editorialPublicationStatus is "editorial-only-scholarly-review-pending"',
      met: doc.editorialPublicationStatus === "editorial-only-scholarly-review-pending",
    },
    { key: "arabic-present", label: "Arabic text is present", met: !!doc.arabicText },
    { key: "english-translation-present", label: "English translation is present", met: !!doc.translationEn },
    { key: "danish-translation-present", label: "Danish translation is present", met: !!doc.translationDa },
    {
      key: "valid-source-reference-present",
      label: "At least one source reference is present",
      met: Array.isArray(doc.sourceReferences) && doc.sourceReferences.length > 0,
    },
    {
      key: "editorial-approval-present",
      label: "An approved editorial board approval is present",
      met: hasApprovedDuaDhikrBoard(doc.boardApprovals, "editorial"),
    },
  ];
}

export function isDuaDhikrEntryEditoriallyPubliclyEligible(
  doc: DuaDhikrEntryEditorialEligibilityInput,
): boolean {
  return getDuaDhikrEditorialEligibilityConditions(doc).every((condition) => condition.met);
}

/**
 * Owner-approved English-first pathway — a THIRD, separate, additive
 * eligibility rule, alongside (never replacing or weakening) the canonical
 * scholarly pathway above and the editorial-review-pending bypass. Exists
 * for content the content owner has explicitly approved and stated was
 * accepted as pre-verified from the supplied source document, with
 * independent re-verification explicitly waived by the owner — see
 * content-intake-workspace/OWNER_PREVERIFICATION_DECISION.md (local,
 * git-excluded) for the full record of that decision. This pathway
 * deliberately never checks translationDa: an English-first launch must
 * never be blocked by, and must never imply, Danish readiness.
 *
 * `editorialPublicationStatus == "owner-approved-english-first"` reuses
 * the existing field (the same one the editorial bypass already uses) — no
 * new field was added; the value itself is the recorded decision, exactly
 * as "editorial-only-scholarly-review-pending" already is for the existing
 * bypass. This pathway NEVER claims scholarly review, NEVER sets a board
 * approval, and any UI surfacing content eligible only through this
 * pathway must show a neutral "content-owner approved, not yet
 * independently scholarly reviewed" note — never a claim of scholarly
 * approval or authentication.
 */
export interface DuaDhikrEntryOwnerApprovedEnglishEligibilityInput {
  editorialPublicationStatus?: string;
  importIdentifier?: string;
  arabicText?: string;
  translationEn?: string;
  collections?: unknown[];
  boardApprovals?: DuaDhikrBoardApprovalLike[];
}

// length(field) > 0, not defined(field) && field != "" — see the note on
// DUA_DHIKR_ELIGIBILITY_GROQ above. This is the pathway that actually
// exhibited the bug: 4 of 425 owner-approved-English entries (those with
// arabicText/translationEn over ~1000 characters — full Qur'anic ayat
// rather than short duas) were silently excluded from every public query
// because defined() returned false for their long field values, even
// though the fields were genuinely present with real content.
export const DUA_DHIKR_OWNER_APPROVED_ENGLISH_ELIGIBILITY_GROQ = `
  editorialPublicationStatus == "owner-approved-english-first"
  && length(importIdentifier) > 0
  && length(arabicText) > 0
  && length(translationEn) > 0
  && count(collections) > 0
`.trim();

export interface DuaDhikrOwnerApprovedEnglishEligibilityCondition {
  key:
    | "owner-approved-english-first-status-set"
    | "import-identifier-present"
    | "arabic-present"
    | "english-translation-present"
    | "collection-reference-present"
    | "no-fabricated-scholarly-approval";
  label: string;
  met: boolean;
}

export function getDuaDhikrOwnerApprovedEnglishEligibilityConditions(
  doc: DuaDhikrEntryOwnerApprovedEnglishEligibilityInput,
): DuaDhikrOwnerApprovedEnglishEligibilityCondition[] {
  return [
    {
      key: "owner-approved-english-first-status-set",
      label: 'editorialPublicationStatus is "owner-approved-english-first"',
      met: doc.editorialPublicationStatus === "owner-approved-english-first",
    },
    { key: "import-identifier-present", label: "Import identifier is present", met: !!doc.importIdentifier },
    { key: "arabic-present", label: "Arabic text is present", met: !!doc.arabicText },
    { key: "english-translation-present", label: "English translation is present", met: !!doc.translationEn },
    {
      key: "collection-reference-present",
      label: "At least one canonical collection reference is present",
      met: Array.isArray(doc.collections) && doc.collections.length > 0,
    },
    {
      key: "no-fabricated-scholarly-approval",
      label: "No scholarly board approval is claimed via this pathway",
      met: !hasApprovedDuaDhikrBoard(doc.boardApprovals, "scholarly"),
    },
  ];
}

export function isDuaDhikrEntryOwnerApprovedEnglishEligible(
  doc: DuaDhikrEntryOwnerApprovedEnglishEligibilityInput,
): boolean {
  return getDuaDhikrOwnerApprovedEnglishEligibilityConditions(doc).every((condition) => condition.met);
}

/**
 * Combined input covering every field any of the three pathways reads.
 * The locale-aware functions below are the ones public fetch code should
 * call — never the three per-pathway functions individually, so a future
 * fourth pathway only needs to be added in one place.
 */
export interface DuaDhikrEntryLocaleEligibilityInput
  extends DuaDhikrEntryEligibilityInput,
    DuaDhikrEntryEditorialEligibilityInput,
    DuaDhikrEntryOwnerApprovedEnglishEligibilityInput {}

export type DuaDhikrLocale = "en" | "da";

/**
 * English eligibility = canonical scholarly pathway OR editorial bypass OR
 * owner-approved-English-first — any one is sufficient. Missing
 * translationDa never blocks this: only the canonical/editorial pathways
 * check it, and the owner-approved pathway never does.
 */
export function isDuaDhikrEntryEnglishPubliclyEligible(doc: DuaDhikrEntryLocaleEligibilityInput): boolean {
  return (
    isDuaDhikrEntryPubliclyEligible(doc) ||
    isDuaDhikrEntryEditoriallyPubliclyEligible(doc) ||
    isDuaDhikrEntryOwnerApprovedEnglishEligible(doc)
  );
}

/**
 * Danish eligibility = canonical scholarly pathway OR editorial bypass —
 * both already hard-require translationDa. The owner-approved-English-first
 * pathway is deliberately excluded here: it never satisfies Danish
 * eligibility under any circumstance, so an English-first launch can never
 * accidentally surface as Danish content.
 */
export function isDuaDhikrEntryDanishPubliclyEligible(doc: DuaDhikrEntryLocaleEligibilityInput): boolean {
  return isDuaDhikrEntryPubliclyEligible(doc) || isDuaDhikrEntryEditoriallyPubliclyEligible(doc);
}

/** Convenience single entry point matching the `(entry, locale)` shape — delegates to the two functions above; never introduces an ambiguous fallback locale. */
export function isDuaDhikrEntryPubliclyEligibleForLocale(doc: DuaDhikrEntryLocaleEligibilityInput, locale: DuaDhikrLocale): boolean {
  return locale === "en" ? isDuaDhikrEntryEnglishPubliclyEligible(doc) : isDuaDhikrEntryDanishPubliclyEligible(doc);
}
