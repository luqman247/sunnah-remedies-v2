# Review Decision Register — "I am feeling…"

The master tracking sheet — one row per architected feeling state, all 20. This is the source of truth for "has this been approved," distinct from `SCHOLARLY_REVIEW_PACKAGE.md` (the detailed working document reviewers read from) and `CONTENT_GAP_REGISTER.md` (the detail behind the two blocked rows).

**Every approval column below is empty by design.** No decision has been made by anyone yet. Do not infer an approval from a state having drafted content — drafted content means "ready for review," nothing more.

**Legend:** Content available = drafted introduction/next-step copy exists. Pairing available = at least one real `duaDhikrEntry` is referenced. English ready / Danish ready = copy is drafted and internally consistent, *not* reviewed or published. Approval columns: leave blank until a named reviewer signs off; use ✅ (approved), ⚠️ (approved with condition — note in Notes), ❌ (rejected/not approved), or leave blank for "not yet reviewed." **Never pre-fill with ✅.**

| # | State | Slug | Status | Content available | Pairing available | English ready | Danish ready | Scholarly approval | Editorial approval | Safeguarding/clinical approval | Owner approval | Final publication decision | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Grieving a Loss | `grieving-a-loss` | Launch | Yes | Yes (2) | Yes | Drafted, blocked upstream | | | (required — heightened) | | | See package row 1 |
| 2 | Feeling Alone | `feeling-alone` | Launch | **No** | **No** | No | No | | | (required — heightened) | | | See content-gap register |
| 3 | Weighed Down by Guilt or Regret | `weighed-down-by-guilt` | Launch | Yes | Yes (2) | Yes | Drafted, blocked upstream | | | n/a — standard | | | See package row 2 |
| 4 | Anxious or Worried | `feeling-anxious` | Launch | Yes | Yes (2, but duplicate content — see notes) | Yes | Drafted, blocked upstream | | | (required — heightened) | | | Two featured entries are the same duʿā twice — resolve before approval |
| 5 | Overwhelmed | `feeling-overwhelmed` | Launch | Yes | Yes (2) | Yes | Drafted, blocked upstream | | | n/a — standard | | | See package row 4 |
| 6 | Restless at Night | `restless-at-night` | Launch | Yes | Yes (1) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Single-entry state |
| 7 | Feeling Weary | `feeling-weary` | Launch | Yes | Yes (1, shared with row 5) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Confirm reused-entry fit |
| 8 | Angry or Frustrated | `feeling-angry` | Launch | Yes | Yes (1) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Single-entry state |
| 9 | Struggling with Envy | `struggling-with-envy` | Launch | **No** | **No** | No | No | | | n/a — standard | | | See content-gap register |
| 10 | Distant from Allah | `feeling-distant-from-allah` | Launch | Yes | Yes (1) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Strong match |
| 11 | Struggling with Sincerity | `struggling-with-sincerity` | Launch | Yes | Yes (1) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Priority tone check — SPEC §7.2 |
| 12 | Grateful | `feeling-grateful` | Launch | Yes | Yes (2) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Confirm entries are distinct; blank Qurʾān citation fields |
| 13 | At Peace | `feeling-at-peace` | Launch | Yes | Yes (2) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Blank Qurʾān citation field on entry 2 |
| 14 | Hopeful | `feeling-hopeful` | Launch | Yes | Yes (1, imperfect fit) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Tawakkul-themed, not hope-specific |
| 15 | Facing a Difficult Decision | `facing-a-decision` | Launch | Yes | Yes (1) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Strongest pairing in the taxonomy |
| 16 | Facing Illness | `facing-illness` | Launch | Yes | Yes (2) | Yes | Drafted, blocked upstream | | | (required — heightened) | | | See package row 14 |
| 17 | Afraid of What Lies Ahead | `afraid-of-what-lies-ahead` | Launch | Yes | Yes (1, imperfect fit, shared with row 14) | Yes | Drafted, blocked upstream | | | n/a — standard | | | Same caveat as row 14 |
| 18 | Troubled by Doubts | `troubled-by-doubts` | **Deferred** (architected) | Yes | Yes (2) | Yes | Drafted, blocked upstream | (dedicated working group required — not ordinary review) | | (required — heightened) | | | Cannot move to launch without the working group named in SPEC §4 |
| 19 | Feeling Let Down | `feeling-disappointed` | **Deferred** (scope decision) | No | No | No | No | n/a | n/a | n/a | | | Not in scope this round — SPEC §4 |
| 20 | Impatient | `feeling-impatient` | **Deferred** (scope decision) | No | No | No | No | n/a | n/a | n/a | | | Not in scope this round — SPEC §4 |

**Totals:** 20 architected · 17 launch candidates · 3 deferred · 13 launch candidates with reviewable content · 2 launch candidates blocked by missing content · 0 approved by any reviewer · 0 published.

## How to update this register

When a reviewer completes their review of a state (using `SCHOLARLY_REVIEW_PACKAGE.md`), come back to this file and:
1. Mark the relevant approval column (✅ / ⚠️ / ❌) with their initials and date in Notes, e.g. "✅ — AH, 2026-08-02."
2. Only mark "Final publication decision" once **every** required approval column for that row is filled (scholarly + editorial always; safeguarding/clinical additionally for heightened rows; owner approval for all).
3. Danish "Final publication decision" should remain blank/"Not eligible" independently of English — see `docs/i-am-feeling/OWNER_REVIEW_GUIDE.md`'s "Danish release strategy" section for the exact staged-release model and gate.
