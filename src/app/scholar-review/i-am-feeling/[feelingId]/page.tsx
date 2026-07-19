import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionIdFromCookie } from "@/lib/scholar-review/access-control";
import { getFeelingStateForReview, FEELING_FAMILIES } from "@/lib/scholar-review/feeling-review-data";
import { getFeelingStateReview, listDuaDhikrEntryReviews, getReviewSession } from "@/lib/scholar-review/review-records";
import { computeFeelingReadiness } from "@/lib/scholar-review/progress";
import { MISSING_CONTENT_NOTES } from "@/lib/scholar-review/missing-content-notes";
import { FeelingStateReviewForm } from "@/components/scholar-review/FeelingStateReviewForm";

export default async function FeelingStateDetailPage({ params }: { params: Promise<{ feelingId: string }> }) {
  const { feelingId } = await params;
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null;

  const state = await getFeelingStateForReview(feelingId);
  if (!state) notFound();

  const [review, entryReviews, session] = await Promise.all([
    state.documentId ? getFeelingStateReview(sessionId, state.documentId) : Promise.resolve(null),
    listDuaDhikrEntryReviews(sessionId),
    getReviewSession(sessionId),
  ]);

  const family = FEELING_FAMILIES.find((f) => f.key === state.family);
  const readiness = computeFeelingReadiness(
    state.featuredEntries.map((e) => e.entryId),
    entryReviews,
  );
  const missingNote = MISSING_CONTENT_NOTES[state.slug];
  const entryReviewById = new Map(entryReviews.map((r) => [r.entryId, r]));

  return (
    <div>
      <Link href="/scholar-review/i-am-feeling" style={styles.backLink}>
        ← Back to feeling states
      </Link>
      <p style={styles.eyebrow}>
        &ldquo;I am feeling&hellip;&rdquo; · {family?.titleEn ?? state.family}
      </p>
      <h1 style={styles.heading}>{state.labelEn}</h1>
      <div style={styles.statusRow}>
        <span style={state.launchStatus === "launch" ? styles.statusBadge : styles.statusBadgeMuted}>{state.launchStatus === "launch" ? "Launch candidate" : `Deferred (${state.launchStatus})`}</span>
        {state.safeguardingLevel !== "standard" && <span style={styles.safeguardBadge}>Safeguarding: {state.safeguardingLevel}</span>}
      </div>
      {state.deferralNote && state.launchStatus !== "launch" && (
        <p style={styles.hint}>
          <strong>Deferral note:</strong> {state.deferralNote}
        </p>
      )}

      {state.featuredEntries.length > 0 && !readiness.ready && (
        <div style={styles.warningBanner}>
          <strong>Cross-project dependency:</strong> this state cannot be considered publication-ready until every entry it references has an approved
          decision in the Duʿā &amp; Dhikr review. {readiness.blockedByEntryIds.length} entry review{readiness.blockedByEntryIds.length === 1 ? "" : "s"} still
          pending or not approved. This is informational only — nothing is auto-published.
        </div>
      )}

      {missingNote && (
        <div style={styles.gapBanner}>
          <strong>No content currently paired with this state — documented search findings:</strong>
          <p style={{ margin: "0.5rem 0 0" }}>
            <strong>Search performed:</strong> {missingNote.searchPerformed}
          </p>
          <p style={{ margin: "0.5rem 0 0" }}>
            <strong>Why no candidate was used:</strong> {missingNote.rejectedCandidateReasoning}
          </p>
          <p style={{ margin: "0.5rem 0 0" }}>
            <strong>Suggested themes for a scholar to consider:</strong> {missingNote.suggestedThemes}
          </p>
          <p style={{ margin: "0.5rem 0 0" }}>
            Use the &ldquo;Replace religious-content pairing&rdquo; decision below to suggest new content. This state defaults to unpublished until content
            is sourced and approved.
          </p>
        </div>
      )}

      <div style={styles.contentGrid}>
        <section style={styles.contentCard}>
          <h2 style={styles.sectionHeading}>Introduction</h2>
          <p style={styles.bodyText}>{state.introductionEn || <em style={styles.missing}>Missing</em>}</p>

          <h2 style={styles.sectionHeading}>Practical next step</h2>
          <p style={styles.bodyText}>{state.practicalNextStepEn || <em style={styles.missing}>Missing</em>}</p>

          {state.professionalSupportNoteEn && (
            <>
              <h2 style={styles.sectionHeading}>Professional support note</h2>
              <p style={styles.bodyText}>{state.professionalSupportNoteEn}</p>
            </>
          )}

          <h2 style={styles.sectionHeading}>Featured Duʿā &amp; Dhikr entries ({state.featuredEntries.length})</h2>
          {state.featuredEntries.length === 0 && <p style={styles.missing}>No entries currently paired — see the gap note above.</p>}
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {state.featuredEntries.map((fe) => {
              const entryReview = entryReviewById.get(fe.entryId);
              return (
                <li key={fe.entryId} style={styles.entryItem}>
                  <Link href={`/scholar-review/dua-dhikr/${fe.entryId}`} style={{ fontWeight: 600, color: "#0E3B2E" }}>
                    {fe.entry?.titleEn ?? fe.entryId}
                  </Link>
                  <span style={entryReview?.decision ? styles.entryDecisionBadge : styles.entryDecisionBadgeEmpty}>{entryReview?.decision ?? "not reviewed"}</span>
                  {fe.reflectionEn && <p style={{ margin: "0.3rem 0 0", fontSize: "0.85rem", color: "#4A4438" }}>{fe.reflectionEn}</p>}
                </li>
              );
            })}
          </ul>

          {state.relatedFeelingSlugs.length > 0 && (
            <>
              <h2 style={styles.sectionHeading}>Related states</h2>
              <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                {state.relatedFeelingSlugs.map((slug) => (
                  <li key={slug}>
                    <Link href={`/scholar-review/i-am-feeling/${slug}`} style={{ color: "#0E3B2E" }}>
                      {slug}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <div>
          {state.documentId ? (
            <FeelingStateReviewForm
              feelingStateDocId={state.documentId}
              initial={review}
              featuredEntries={state.featuredEntries.map((fe) => ({ entryId: fe.entryId, titleEn: fe.entry?.titleEn ?? fe.entryId }))}
              locked={!!session?.feelingProgrammeSubmittedAt}
            />
          ) : (
            <div style={styles.contentCard}>
              <p style={styles.missing}>No staging document exists yet for this state — it cannot be reviewed until one is created.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backLink: { fontSize: "0.85rem", color: "#0E3B2E", textDecoration: "none" },
  eyebrow: { margin: "1rem 0 0", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.4rem 0 0.6rem", fontSize: "1.6rem", color: "#0E3B2E" },
  statusRow: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" },
  statusBadge: { fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E" },
  statusBadgeMuted: { fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 3, background: "#F0EBDF", color: "#6B6455" },
  safeguardBadge: { fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 3, background: "#FBE7E7", color: "#9A2B2B" },
  hint: { fontSize: "0.85rem", color: "#6B6455", margin: "0 0 1rem" },
  warningBanner: { background: "#F0EBDF", border: "1px solid #C9C2B1", borderRadius: 4, padding: "0.9rem 1rem", marginBottom: "1rem", fontSize: "0.88rem", color: "#4A4438" },
  gapBanner: { background: "#FFF7E5", border: "1px solid #E9CE8A", borderRadius: 4, padding: "0.9rem 1rem", marginBottom: "1.25rem", fontSize: "0.87rem", color: "#4A4438", lineHeight: 1.6 },
  contentGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 1fr)", gap: "1.5rem", alignItems: "start" },
  contentCard: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.5rem" },
  sectionHeading: { fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#6B6455", margin: "1.1rem 0 0.3rem" },
  bodyText: { fontSize: "0.95rem", lineHeight: 1.6, color: "#20211C", margin: 0 },
  missing: { color: "#9A2B2B" },
  entryItem: { padding: "0.6rem 0.75rem", background: "#F9F6EF", border: "1px solid #EDE7D9", borderRadius: 3 },
  entryDecisionBadge: { marginLeft: "0.6rem", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E" },
  entryDecisionBadgeEmpty: { marginLeft: "0.6rem", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: 3, background: "#F0EBDF", color: "#6B6455" },
};
