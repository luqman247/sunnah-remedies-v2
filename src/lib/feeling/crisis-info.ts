/**
 * "I am feeling…" — crisis-contact verification record (SPEC §8, §14).
 *
 * Every item here was checked against a live official source in this
 * implementation session (see verifiedSourceUrl) — 999/NHS 111 guidance and
 * the Samaritans phone number were successfully confirmed directly from
 * nhs.uk and samaritans.org. Shout's short code could NOT be independently
 * verified this session: giveusashout.org returned HTTP 403 to automated
 * access, and the NHS urgent-mental-health-help page (checked directly for
 * this purpose) does not mention Shout at all. Per SPEC §8/§14's explicit,
 * conservative rule ("do not fabricate telephone numbers" / crisis details
 * must be "traced to an official source"), Shout is recorded here as
 * verified: false and is NOT rendered on the urgent-support page until an
 * editor with direct browser access confirms it and updates this record —
 * this is a deliberate content gap, not an oversight (see the
 * implementation report / docs/i-am-feeling/SAFEGUARDING_VERIFICATION.md).
 *
 * Never used as the authority for this record: the two owner-approved
 * "I am feeling…" reference sites (mydailyduas.com, islamestic.com) — SPEC
 * §7.1's discovery-only approval explicitly does not extend to
 * safety-critical content (SPEC §8's rule, restated).
 */

export interface CrisisContactItem {
  key: "emergency999" | "nhs111" | "samaritans" | "shout";
  verified: boolean;
  verifiedAt?: string;
  verifiedSourceUrl?: string;
  note?: string;
}

export const CRISIS_INFO_VERIFICATION = {
  /** Date the record below was last checked against live official sources. */
  verifiedAt: "2026-07-19",
  /** SPEC §14's 90-day staleness threshold. */
  staleAfterDays: 90,
  items: [
    {
      key: "emergency999",
      verified: true,
      verifiedAt: "2026-07-19",
      verifiedSourceUrl: "https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/",
    },
    {
      key: "nhs111",
      verified: true,
      verifiedAt: "2026-07-19",
      verifiedSourceUrl: "https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/",
    },
    {
      key: "samaritans",
      verified: true,
      verifiedAt: "2026-07-19",
      verifiedSourceUrl: "https://www.samaritans.org/how-we-can-help/contact-samaritan/",
    },
    {
      key: "shout",
      verified: false,
      note: "Could not be independently verified this session — official site returned HTTP 403 to automated access. Do not render until an editor verifies directly and updates this record.",
    },
  ] satisfies CrisisContactItem[],
};

function daysSince(dateString: string, now: Date): number {
  const then = new Date(dateString);
  if (Number.isNaN(then.getTime())) return Number.POSITIVE_INFINITY;
  return (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);
}

export function isCrisisInfoFresh(now: Date = new Date()): boolean {
  return daysSince(CRISIS_INFO_VERIFICATION.verifiedAt, now) <= CRISIS_INFO_VERIFICATION.staleAfterDays;
}

export function getVerifiedCrisisItemKeys(): Set<CrisisContactItem["key"]> {
  return new Set(CRISIS_INFO_VERIFICATION.items.filter((i) => i.verified).map((i) => i.key));
}

export function isCrisisItemVerified(key: CrisisContactItem["key"]): boolean {
  return getVerifiedCrisisItemKeys().has(key);
}

/**
 * Whether the urgent-support page's core curated content (999/111 guidance
 * plus at least one direct, named crisis line) is safe to publish right
 * now — fresh AND independently verified. SPEC §14: stale or unverified
 * crisis information must block release of that content. The 999 line
 * itself (the UK's constitutional emergency number, not a charity-specific
 * number subject to change) always renders regardless of this check — see
 * the urgent-support page component.
 */
export function isUrgentSupportPagePublishable(now: Date = new Date()): boolean {
  if (!isCrisisInfoFresh(now)) return false;
  const verified = getVerifiedCrisisItemKeys();
  return verified.has("nhs111") && verified.has("samaritans");
}
