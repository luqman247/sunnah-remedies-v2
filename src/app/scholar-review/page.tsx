import Link from "next/link";
import { getSessionIdFromCookie } from "@/lib/scholar-review/access-control";
import { listDuaDhikrEntriesForReview, listDuaDhikrCollectionsForReview, findSuspectedDuplicateEntries } from "@/lib/scholar-review/dua-dhikr-review-data";
import { listFeelingStatesForReview } from "@/lib/scholar-review/feeling-review-data";
import { listDuaDhikrEntryReviews, listDuaDhikrCollectionReviews, listFeelingStateReviews, getReviewSession } from "@/lib/scholar-review/review-records";
import {
  computeDuaDhikrProgress,
  computeFeelingProgress,
  computeDuaDhikrEntrySubmissionBlockers,
  computeDuaDhikrCollectionSubmissionBlockers,
  computeFeelingStateSubmissionBlockers,
} from "@/lib/scholar-review/progress";
import { ProgrammeSubmitPanel } from "@/components/scholar-review/ProgrammeSubmitPanel";

export default async function ScholarReviewDashboard() {
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null; // layout already guards this; keeps TS narrowing simple

  const [session, entries, collections, feelingStates, entryReviews, collectionReviews, feelingReviews, duplicates] = await Promise.all([
    getReviewSession(sessionId),
    listDuaDhikrEntriesForReview(),
    listDuaDhikrCollectionsForReview(),
    listFeelingStatesForReview(),
    listDuaDhikrEntryReviews(sessionId),
    listDuaDhikrCollectionReviews(sessionId),
    listFeelingStateReviews(sessionId),
    findSuspectedDuplicateEntries(),
  ]);

  const duaDhikr = computeDuaDhikrProgress(entries, entryReviews, collections.length, collectionReviews);
  const feeling = computeFeelingProgress(feelingStates, feelingReviews);

  const totalItems = duaDhikr.totalEntries + duaDhikr.totalCollections + feeling.totalArchitected;
  const totalReviewed = duaDhikr.reviewedEntries + duaDhikr.collectionsReviewed + feeling.reviewed;
  const overallPercent = totalItems === 0 ? 0 : Math.round((totalReviewed / totalItems) * 100);

  const nextUnreviewedEntry = entries.find((e) => !entryReviews.some((r) => r.entryId === e._id && r.decision));
  const nextUnreviewedFeeling = feelingStates.find((s) => !feelingReviews.some((r) => r.feelingStateId === s.documentId && r.decision));

  const duaDhikrSubmitted = !!session?.duaDhikrProgrammeSubmittedAt;
  const feelingSubmitted = !!session?.feelingProgrammeSubmittedAt;

  const entryBlockers = computeDuaDhikrEntrySubmissionBlockers(entries, entryReviews);
  const collectionBlockers = computeDuaDhikrCollectionSubmissionBlockers(collections, collectionReviews);
  const duaDhikrBlockers = {
    missingDecisionCount: entryBlockers.missingDecisionCount + collectionBlockers.missingDecisionCount,
    missingCommentCount: entryBlockers.missingCommentCount + collectionBlockers.missingCommentCount,
    totalBlockers: entryBlockers.totalBlockers + collectionBlockers.totalBlockers,
  };
  const duaDhikrBlockerHref = entryBlockers.firstBlockerId
    ? `/scholar-review/dua-dhikr/${entryBlockers.firstBlockerId}`
    : collectionBlockers.firstBlockerId
      ? `/scholar-review/dua-dhikr/collections/${collectionBlockers.firstBlockerId}`
      : undefined;

  const feelingBlockers = computeFeelingStateSubmissionBlockers(feelingStates, feelingReviews);
  const feelingBlockerHref = feelingBlockers.firstBlockerId ? `/scholar-review/i-am-feeling/${feelingBlockers.firstBlockerId}` : undefined;

  return (
    <div>
      <p style={styles.eyebrow}>Sunnah Remedies Scholarly Review</p>
      <h1 style={styles.heading}>Review dashboard</h1>
      <p style={styles.body}>
        You are reviewing two programmes: the full Duʿā &amp; Dhikr Knowledge Library, and the &ldquo;I am feeling&hellip;&rdquo; emotional-discovery
        experience. Your decisions here are proposals for the project owner and are never published automatically.
      </p>

      <section style={styles.overallCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.05rem", color: "#0E3B2E" }}>Overall progress</h2>
          <span style={{ fontSize: "0.9rem", color: "#6B6455" }}>
            {totalReviewed} of {totalItems} items reviewed ({overallPercent}%)
          </span>
        </div>
        <ProgressBar percent={overallPercent} />
      </section>

      {duplicates.length > 0 && (
        <section style={styles.warningCard}>
          <h2 style={{ margin: "0 0 0.4rem", fontSize: "1rem", color: "#9A6B00" }}>
            Suspected duplicate entries ({duplicates.length} group{duplicates.length === 1 ? "" : "s"})
          </h2>
          <p style={{ margin: "0 0 0.6rem", fontSize: "0.88rem", color: "#4A4438" }}>
            Entries sharing identical Arabic text. This includes the known <code>lwa-215</code> / <code>lwa-378</code> pair. Nothing is
            auto-consolidated — each group needs an explicit duplicate-resolution decision on the entry review page.
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem" }}>
            {duplicates.slice(0, 5).map((group) => (
              <li key={group.arabicText.slice(0, 40)}>
                {group.entries.map((e) => e.titleEn).join(" ↔ ")}
              </li>
            ))}
            {duplicates.length > 5 && <li>and {duplicates.length - 5} more…</li>}
          </ul>
        </section>
      )}

      <div style={styles.programmeGrid}>
        <section style={styles.programmeCard}>
          <h2 style={{ margin: "0 0 0.25rem", color: "#0E3B2E" }}>Duʿā &amp; Dhikr Library</h2>
          <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#6B6455" }}>
            {duaDhikrSubmitted ? "Submitted — locked from casual editing." : "In progress"}
          </p>
          <ProgressBar percent={duaDhikr.totalEntries === 0 ? 0 : Math.round((duaDhikr.reviewedEntries / duaDhikr.totalEntries) * 100)} />
          <dl style={styles.statList}>
            <Stat label="Entries reviewed" value={`${duaDhikr.reviewedEntries} / ${duaDhikr.totalEntries}`} />
            <Stat label="Approved" value={duaDhikr.approvedEntries} />
            <Stat label="Requiring changes" value={duaDhikr.entriesRequiringChanges} />
            <Stat label="Source verification needed" value={duaDhikr.entriesRequiringSourceVerification} />
            <Stat label="Kept unpublished / rejected" value={duaDhikr.entriesKeptUnpublished} />
            <Stat label="Collections reviewed" value={`${duaDhikr.collectionsReviewed} / ${duaDhikr.totalCollections}`} />
            <Stat label="Entries missing a source" value={duaDhikr.entriesMissingSource} />
            <Stat label="Entries missing hadith grading" value={duaDhikr.entriesMissingGrading} />
          </dl>
          <div style={styles.actionRow}>
            <Link href="/scholar-review/dua-dhikr" style={styles.primaryLink}>
              Continue review
            </Link>
            {nextUnreviewedEntry && (
              <Link href={`/scholar-review/dua-dhikr/${nextUnreviewedEntry._id}`} style={styles.secondaryLink}>
                Review next unreviewed entry
              </Link>
            )}
            <Link href="/scholar-review/dua-dhikr/collections" style={styles.secondaryLink}>
              Collections
            </Link>
          </div>
          <ProgrammeSubmitPanel
            programme="dua-dhikr"
            programmeLabel="Duʿā & Dhikr Library review"
            blockers={duaDhikrBlockers}
            alreadySubmitted={duaDhikrSubmitted}
            submittedAt={session?.duaDhikrProgrammeSubmittedAt}
            firstBlockerHref={duaDhikrBlockerHref}
          />
        </section>

        <section style={styles.programmeCard}>
          <h2 style={{ margin: "0 0 0.25rem", color: "#0E3B2E" }}>&ldquo;I am feeling&hellip;&rdquo;</h2>
          <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#6B6455" }}>
            {feelingSubmitted ? "Submitted — locked from casual editing." : "In progress"}
          </p>
          <ProgressBar percent={feeling.totalArchitected === 0 ? 0 : Math.round((feeling.reviewed / feeling.totalArchitected) * 100)} />
          <dl style={styles.statList}>
            <Stat label="States reviewed" value={`${feeling.reviewed} / ${feeling.totalArchitected}`} />
            <Stat label="Launch candidates" value={feeling.launchCandidates} />
            <Stat label="Deferred states" value={feeling.deferredStates} />
            <Stat label="Missing-content states" value={feeling.missingContentStates} />
            <Stat label="Pairing concerns raised" value={feeling.pairingConcerns} />
            <Stat label="Safeguarding-sensitive states" value={feeling.safeguardingSensitiveStates} />
          </dl>
          <div style={styles.actionRow}>
            <Link href="/scholar-review/i-am-feeling" style={styles.primaryLink}>
              Continue review
            </Link>
            {nextUnreviewedFeeling && (
              <Link href={`/scholar-review/i-am-feeling/${nextUnreviewedFeeling.slug}`} style={styles.secondaryLink}>
                Review next unreviewed state
              </Link>
            )}
          </div>
          <ProgrammeSubmitPanel
            programme="feeling"
            programmeLabel="“I am feeling…” review"
            blockers={feelingBlockers}
            alreadySubmitted={feelingSubmitted}
            submittedAt={session?.feelingProgrammeSubmittedAt}
            firstBlockerHref={feelingBlockerHref}
          />
        </section>
      </div>

      <div style={styles.actionRow}>
        <Link href="/scholar-review/summary" style={styles.secondaryLink}>
          View owner summary
        </Link>
      </div>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div style={{ background: "#EDE7D9", borderRadius: 4, height: 8, overflow: "hidden" }}>
      <div style={{ background: "#0E3B2E", height: "100%", width: `${percent}%`, transition: "width 0.2s" }} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.25rem 0", borderBottom: "1px solid #F0EBDF" }}>
      <dt style={{ color: "#6B6455" }}>{label}</dt>
      <dd style={{ margin: 0, fontWeight: 600, color: "#20211C" }}>{value}</dd>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: { margin: 0, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.5rem 0 0.75rem", fontSize: "1.8rem", color: "#0E3B2E" },
  body: { margin: "0 0 1.5rem", color: "#4A4438", lineHeight: 1.6, maxWidth: 720 },
  overallCard: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.25rem", marginBottom: "1.25rem" },
  warningCard: { background: "#FFF7E5", border: "1px solid #E9CE8A", borderRadius: 4, padding: "1.25rem", marginBottom: "1.25rem" },
  programmeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" },
  programmeCard: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.5rem" },
  statList: { margin: "1rem 0 0" },
  actionRow: { display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" },
  primaryLink: { background: "#0E3B2E", color: "#F6F3EE", padding: "0.55rem 1rem", borderRadius: 3, textDecoration: "none", fontSize: "0.88rem", fontWeight: 600 },
  secondaryLink: { border: "1px solid #C9C2B1", color: "#0E3B2E", padding: "0.55rem 1rem", borderRadius: 3, textDecoration: "none", fontSize: "0.88rem" },
};
