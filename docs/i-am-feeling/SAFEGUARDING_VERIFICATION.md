# Safeguarding Verification Record — "I am feeling…" Urgent Support

Canonical record for `src/lib/feeling/crisis-info.ts`. Update this file (and the code record it documents) every time crisis-contact information is re-verified — see the 90-day staleness gate in `isCrisisInfoFresh()`.

## Current status (as of 2026-07-19)

| Service | Purpose | Contact route | Official source checked | Verification date | Next verification deadline | Included or excluded | Reason | Reviewer | Notes |
|---|---|---|---|---|---|---|---|---|---|
| UK emergency services | Immediate danger to life | Call 999 | `nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/` | 2026-07-19 | 2026-10-17 | **Included** | Standing national guidance, independently confirmed live | Automated (this session) | Not gated behind the 90-day recheck — a constitutional emergency number, not a charity-specific one subject to routine change |
| NHS 111 | Urgent, non-emergency mental health support | Call 111, select mental health option | Same NHS page as above | 2026-07-19 | 2026-10-17 | **Included** | Standing national guidance, independently confirmed live | Automated (this session) | Same as above |
| Samaritans | 24/7 crisis listening, any topic | Call 116 123 | `samaritans.org/how-we-can-help/contact-samaritan/` | 2026-07-19 | 2026-10-17 | **Included** | Independently confirmed live: free from landlines/mobiles incl. pay-as-you-go, open 24 hours | Automated (this session) | Currently the only named crisis-line service on the live page |
| Shout | 24/7 crisis text support, any topic | Text SHOUT to 85258 | `giveusashout.org` (multiple paths) | Not verified | n/a — cannot schedule a deadline for an unverified item | **Excluded** | Official domain blocked automated access (HTTP 403) on every attempt across two verification rounds; no independent secondary source could confirm the number either | Attempted, automated, twice (this session) — **requires a human with normal browser access to resolve** | Not fabricated. Its absence does not block release — see "Does Shout's omission block release?" below |
| Papyrus HOPELINE247 | Crisis text support, under-35s only | Text 07786 209697 | `nhs.uk/every-mind-matters/urgent-support/` | 2026-07-19 | 2026-10-17 (if adopted) | **Not included — editorial option only** | Genuinely verified, but age-scoped; not a like-for-like Shout replacement, and was not requested for inclusion by default | Automated (this session) | Surfaced as a candidate only. Do not add to the live page without a deliberate editorial scope decision and, if added, its own clear age-range caveat in the copy |

## Does Shout's omission block release?

**No.** The page already provides sufficient verified emergency and crisis routes without it: unconditional 999/A&E guidance for immediate danger, NHS 111 for urgent non-emergency support, and Samaritans as a genuine 24/7, all-topics, all-ages crisis line. Shout would be a good addition once verified, not a required one — a visitor in crisis is never left without a real, verified way to get help today.

## What this means for the live page

`src/app/[locale]/i-am-feeling/urgent-support/page.tsx` renders:
- The 999 / NHS 111 emergency block **unconditionally**, regardless of the verification record's freshness.
- The Samaritans line, because it is independently verified and the overall record is fresh (`isUrgentSupportPagePublishable()` returns `true` as of this date).
- **No Shout line and no Papyrus line.** `isCrisisItemVerified("shout")` is `false`, so the component omits it entirely rather than shipping an unverified number. Papyrus was never added to `crisis-info.ts` at all — it stays a documented editorial option here, not code.

## Verification history (audit trail — do not delete on re-verification, append instead)

### 2026-07-19 — Initial implementation verification

Checked live against the official source for each item, via direct fetch of the named URL (not search results, not a compilation site, not either of the two owner-approved "I am feeling…" reference sites — SPEC §7.1/§8 explicitly exclude those from crisis-information authority).

| Item | Status | Source checked | Result |
|---|---|---|---|
| UK emergency guidance (999) | Verified | NHS urgent-help page | Confirmed: "Call 999 or go to A&E now if someone's life is at risk." |
| NHS 111 mental health option | Verified | Same NHS page | Confirmed: "Get help from 111 online or call 111 and select the mental health option." |
| Samaritans — 116 123 | Verified | samaritans.org | Confirmed: free from landlines and mobiles including pay-as-you-go, open 24 hours a day. |
| Shout — text to 85258 | Not verified | giveusashout.org (HTTP 403) | Not included on the live page. No fabricated number shipped. |

### 2026-07-19 — Follow-up verification attempt (same day, expanded source list)

At the owner's request to resolve release blockers "as far as safely possible," a second, expanded attempt was made to independently verify Shout before concluding the gap is not resolvable in this environment. Five additional official/reputable sources were checked, live:

| Source checked | Result |
|---|---|
| `giveusashout.org/get-help/` | HTTP 403 (blocked automated access) |
| `giveusashout.org` (root) | HTTP 403 (blocked automated access) |
| `nhs.uk/every-mind-matters/urgent-support/` | 200 OK — does not mention Shout/85258. Mentions Papyrus HOPELINE247 instead. |
| `mentalhealth.org.uk/explore-mental-health/get-help-now` | HTTP 404 |
| `rethink.org/.../crisis-services/` | HTTP 404 |
| `web.archive.org` | Not fetchable from this environment (tool-level restriction) |

**Conclusion:** Shout remains genuinely unverifiable from this automated environment — a confirmed pattern, not a single failed attempt. Not evidence Shout is wrong or defunct, only that this environment cannot reach a source that would justify marking it verified. Requires a human with normal browser access; no further automated retries are recommended.

## Outstanding action for editorial

Before the next verification cycle (or sooner, if convenient): an editor with normal (non-automated) browser access should visit `giveusashout.org`, confirm the current short code, cost, and hours, and then:
1. Update `src/lib/feeling/crisis-info.ts`'s `shout` entry to `verified: true` with today's date and the confirmed source URL.
2. Re-run `tests/feeling/feeling-crisis-info-verification.test.ts` to confirm the page now renders the Shout line.
3. Separately, decide whether Papyrus HOPELINE247 should be added at all — it is not currently in `crisis-info.ts` and adding it is an editorial scope decision, not a verification task.

## Re-verification procedure (every ≤90 days, or before any production deploy touching this route)

1. Re-check each item in the current-status table against its official source.
2. Update `CRISIS_INFO_VERIFICATION.verifiedAt` in `src/lib/feeling/crisis-info.ts` to the new check date.
3. Update the current-status table above with the new dates; append a new dated section to the verification history below it (do not delete prior entries).
4. Re-run `tests/feeling/feeling-crisis-info-verification.test.ts` and confirm `isUrgentSupportPagePublishable()` still returns `true` before deploying.
