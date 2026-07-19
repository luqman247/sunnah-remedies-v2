import Link from "next/link";
import { getSessionIdFromCookie } from "@/lib/scholar-review/access-control";
import { listFeelingStatesForReview } from "@/lib/scholar-review/feeling-review-data";
import { listFeelingStateReviews, listDuaDhikrEntryReviews } from "@/lib/scholar-review/review-records";
import { FEELING_STATE_DECISIONS, decisionLabel } from "@/lib/scholar-review/decision-labels";
import { computeFeelingReadiness } from "@/lib/scholar-review/progress";
import { MISSING_CONTENT_NOTES } from "@/lib/scholar-review/missing-content-notes";

export default async function FeelingStateListPage() {
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null;

  const [states, reviews, entryReviews] = await Promise.all([listFeelingStatesForReview(), listFeelingStateReviews(sessionId), listDuaDhikrEntryReviews(sessionId)]);
  const reviewByState = new Map(reviews.map((r) => [r.feelingStateId, r]));

  const launch = states.filter((s) => s.launchStatus === "launch");
  const deferred = states.filter((s) => s.launchStatus !== "launch");

  return (
    <div>
      <p style={styles.eyebrow}>&ldquo;I am feeling&hellip;&rdquo;</p>
      <h1 style={styles.heading}>Feeling states ({states.length})</h1>
      <p style={styles.body}>
        All 20 architected states, including launch candidates and deferred states. Reviewing a state covers both the soundness of its content and whether
        it is appropriately paired with that emotional state.
      </p>

      <h2 style={styles.groupHeading}>Launch candidates ({launch.length})</h2>
      <div style={styles.list}>
        {launch.map((s) => (
          <StateRow key={s.slug} state={s} review={s.documentId ? reviewByState.get(s.documentId) : undefined} entryReviews={entryReviews} />
        ))}
      </div>

      {deferred.length > 0 && (
        <>
          <h2 style={styles.groupHeading}>Deferred states ({deferred.length})</h2>
          <p style={styles.hint}>
            These states are architected but not yet on the public route map. A positive scholarly decision here does not make them public — owner
            approval and publication gates still apply.
          </p>
          <div style={styles.list}>
            {deferred.map((s) => (
              <StateRow key={s.slug} state={s} review={s.documentId ? reviewByState.get(s.documentId) : undefined} entryReviews={entryReviews} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StateRow({
  state,
  review,
  entryReviews,
}: {
  state: Awaited<ReturnType<typeof listFeelingStatesForReview>>[number];
  review: { decision?: string } | undefined;
  entryReviews: Awaited<ReturnType<typeof listDuaDhikrEntryReviews>>;
}) {
  const hasNoContent = state.featuredEntries.length === 0;
  const readiness = computeFeelingReadiness(
    state.featuredEntries.map((e) => e.entryId),
    entryReviews,
  );
  const missingNote = MISSING_CONTENT_NOTES[state.slug];

  return (
    <Link href={`/scholar-review/i-am-feeling/${state.slug}`} style={styles.row}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "#20211C" }}>{state.labelEn}</div>
        <div style={{ fontSize: "0.8rem", color: "#6B6455", marginTop: "0.15rem" }}>
          {state.safeguardingLevel !== "standard" && <span style={styles.safeguardBadge}>{state.safeguardingLevel}</span>}
          {hasNoContent && <span style={styles.missingBadge}>no content paired{missingNote ? " · documented" : ""}</span>}
          {!hasNoContent && !readiness.ready && <span style={styles.blockedBadge}>blocked — {readiness.blockedByEntryIds.length} entry review{readiness.blockedByEntryIds.length === 1 ? "" : "s"} pending</span>}
          {!hasNoContent && readiness.ready && <span style={styles.readyBadge}>entries approved</span>}
        </div>
      </div>
      <span style={review?.decision ? styles.decisionBadge : styles.decisionBadgeEmpty}>{decisionLabel(FEELING_STATE_DECISIONS, review?.decision)}</span>
    </Link>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: { margin: 0, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.5rem 0 0.75rem", fontSize: "1.6rem", color: "#0E3B2E" },
  body: { margin: "0 0 1.25rem", color: "#4A4438", lineHeight: 1.6, maxWidth: 720 },
  groupHeading: { fontSize: "1rem", color: "#0E3B2E", margin: "1.5rem 0 0.5rem" },
  hint: { fontSize: "0.85rem", color: "#6B6455", margin: "0 0 0.75rem" },
  list: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    background: "#FFFFFF",
    border: "1px solid #E2DCCF",
    borderRadius: 4,
    padding: "0.85rem 1rem",
    textDecoration: "none",
    color: "inherit",
  },
  safeguardBadge: { marginRight: "0.5rem", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 3, background: "#FBE7E7", color: "#9A2B2B", textTransform: "capitalize" },
  missingBadge: { marginRight: "0.5rem", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 3, background: "#FFF7E5", color: "#9A6B00" },
  blockedBadge: { marginRight: "0.5rem", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 3, background: "#F0EBDF", color: "#6B6455" },
  readyBadge: { marginRight: "0.5rem", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E" },
  decisionBadge: { fontSize: "0.78rem", padding: "0.3rem 0.65rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E", whiteSpace: "nowrap" },
  decisionBadgeEmpty: { fontSize: "0.78rem", padding: "0.3rem 0.65rem", borderRadius: 3, background: "#F0EBDF", color: "#6B6455", whiteSpace: "nowrap" },
};
