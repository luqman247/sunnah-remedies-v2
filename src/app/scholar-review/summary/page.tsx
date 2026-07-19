import Link from "next/link";
import { listDuaDhikrEntriesForReview, listDuaDhikrCollectionsForReview, findSuspectedDuplicateEntries } from "@/lib/scholar-review/dua-dhikr-review-data";
import { listFeelingStatesForReview } from "@/lib/scholar-review/feeling-review-data";
import {
  listAllDuaDhikrEntryReviews,
  listAllDuaDhikrCollectionReviews,
  listAllFeelingStateReviews,
  listAllReviewSessions,
} from "@/lib/scholar-review/review-records";
import { computeDuaDhikrProgress, computeFeelingProgress, computeFeelingReadiness } from "@/lib/scholar-review/progress";
import { DUA_DHIKR_ENTRY_DECISIONS, DUA_DHIKR_COLLECTION_DECISIONS, FEELING_STATE_DECISIONS, decisionLabel } from "@/lib/scholar-review/decision-labels";

export const metadata = {
  title: "Owner Summary — Sunnah Remedies Scholarly Review",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

export default async function OwnerSummaryPage() {
  const [entries, collections, feelingStates, entryReviews, collectionReviews, feelingReviews, sessions, duplicates] = await Promise.all([
    listDuaDhikrEntriesForReview(),
    listDuaDhikrCollectionsForReview(),
    listFeelingStatesForReview(),
    listAllDuaDhikrEntryReviews(),
    listAllDuaDhikrCollectionReviews(),
    listAllFeelingStateReviews(),
    listAllReviewSessions(),
    findSuspectedDuplicateEntries(),
  ]);

  const duaDhikr = computeDuaDhikrProgress(entries, entryReviews, collections.length, collectionReviews);
  const feeling = computeFeelingProgress(feelingStates, feelingReviews);

  const entriesById = new Map(entries.map((e) => [e._id, e]));
  const entryReviewByEntry = new Map(entryReviews.map((r) => [r.entryId, r]));

  const entryDecisionCounts = countByDecision(entryReviews.map((r) => r.decision));
  const collectionDecisionCounts = countByDecision(collectionReviews.map((r) => r.decision));
  const feelingDecisionCounts = countByDecision(feelingReviews.map((r) => r.decision));

  const entriesMissingDanish = entries.filter((e) => !e.hasTranslationDa).length;
  const feelingStatesMissingDanish = feelingStates.filter((s) => !s.introductionDa).length;

  const correctionProposals = entryReviews.filter((r) => r.proposedArabicCorrection || r.proposedTranslation || r.proposedTransliteration || r.correctedSource);
  const duplicateDecisions = entryReviews.filter((r) => r.decision === "duplicate-consolidate");
  const englishReadyEntries = entryReviews.filter((r) => r.decision === "approved");
  const danishReadyEntries = englishReadyEntries.filter((r) => entriesById.get(r.entryId)?.hasTranslationDa);

  const feelingReadiness = feelingStates.map((s) => ({
    state: s,
    readiness: computeFeelingReadiness(
      s.featuredEntries.map((e) => e.entryId),
      entryReviews,
    ),
    review: s.documentId ? feelingReviews.find((r) => r.feelingStateId === s.documentId) : undefined,
  }));

  return (
    <div>
      <p style={styles.eyebrow}>Sunnah Remedies Scholarly Review</p>
      <h1 style={styles.heading}>Owner summary</h1>
      <p style={styles.body}>
        Read-only aggregate of every scholarly decision recorded across both review programmes. Nothing on this page is published to the live website —
        publication remains a separate, manual owner decision.
      </p>

      <section style={styles.card}>
        <h2 style={styles.sectionHeading}>Reviewers</h2>
        {sessions.length === 0 && <p style={styles.muted}>No reviewer sessions yet.</p>}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Started</th>
              <th style={styles.th}>Duʿā &amp; Dhikr</th>
              <th style={styles.th}>I am feeling…</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s._id}>
                <td style={styles.td}>{s.reviewer.fullName}</td>
                <td style={styles.td}>
                  {s.reviewer.roleOrQualification}
                  {s.reviewer.organisation ? ` · ${s.reviewer.organisation}` : ""}
                </td>
                <td style={styles.td}>{new Date(s.createdAt).toLocaleDateString("en-GB")}</td>
                <td style={styles.td}>{s.duaDhikrProgrammeSubmittedAt ? `Submitted ${new Date(s.duaDhikrProgrammeSubmittedAt).toLocaleDateString("en-GB")}` : "In progress"}</td>
                <td style={styles.td}>{s.feelingProgrammeSubmittedAt ? `Submitted ${new Date(s.feelingProgrammeSubmittedAt).toLocaleDateString("en-GB")}` : "In progress"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionHeading}>Duʿā &amp; Dhikr Library — 425 entries, 27 collections</h2>
        <div style={styles.statGrid}>
          <SummaryStat label="Entries reviewed" value={`${duaDhikr.reviewedEntries} / ${duaDhikr.totalEntries}`} />
          <SummaryStat label="Collections reviewed" value={`${duaDhikr.collectionsReviewed} / ${duaDhikr.totalCollections}`} />
          <SummaryStat label="Approved (English-ready)" value={englishReadyEntries.length} />
          <SummaryStat label="Also Danish-ready" value={danishReadyEntries.length} />
          <SummaryStat label="Missing Danish translation (library-wide)" value={entriesMissingDanish} />
          <SummaryStat label="Suspected duplicate groups" value={duplicates.length} />
        </div>

        <h3 style={styles.subHeading}>Decisions recorded — entries</h3>
        <DecisionTable decisions={DUA_DHIKR_ENTRY_DECISIONS} counts={entryDecisionCounts} />

        <h3 style={styles.subHeading}>Decisions recorded — collections</h3>
        <DecisionTable decisions={DUA_DHIKR_COLLECTION_DECISIONS} counts={collectionDecisionCounts} />

        {correctionProposals.length > 0 && (
          <>
            <h3 style={styles.subHeading}>Proposed corrections ({correctionProposals.length})</h3>
            <p style={styles.hint}>Proposals only — the original entries have not been changed. A human editor applies these after owner sign-off.</p>
            <ul style={styles.list}>
              {correctionProposals.map((r) => (
                <li key={r._id} style={styles.listItem}>
                  <Link href={`/scholar-review/dua-dhikr/${r.entryId}`} style={styles.link}>
                    {entriesById.get(r.entryId)?.titleEn ?? r.entryId}
                  </Link>
                  <span style={styles.muted}>
                    {" — "}
                    {decisionLabel(DUA_DHIKR_ENTRY_DECISIONS, r.decision)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {duplicateDecisions.length > 0 && (
          <>
            <h3 style={styles.subHeading}>Duplicate consolidations proposed ({duplicateDecisions.length})</h3>
            <ul style={styles.list}>
              {duplicateDecisions.map((r) => (
                <li key={r._id} style={styles.listItem}>
                  <Link href={`/scholar-review/dua-dhikr/${r.entryId}`} style={styles.link}>
                    {entriesById.get(r.entryId)?.titleEn ?? r.entryId}
                  </Link>
                  <span style={styles.muted}> — resolution: {r.duplicateResolution ?? "not specified"}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionHeading}>&ldquo;I am feeling&hellip;&rdquo; — 20 architected states</h2>
        <div style={styles.statGrid}>
          <SummaryStat label="States reviewed" value={`${feeling.reviewed} / ${feeling.totalArchitected}`} />
          <SummaryStat label="Launch candidates" value={feeling.launchCandidates} />
          <SummaryStat label="Missing-content states" value={feeling.missingContentStates} />
          <SummaryStat label="Pairing concerns raised" value={feeling.pairingConcerns} />
          <SummaryStat label="Safeguarding-sensitive states" value={feeling.safeguardingSensitiveStates} />
          <SummaryStat label="Missing Danish content" value={feelingStatesMissingDanish} />
        </div>

        <h3 style={styles.subHeading}>Decisions recorded</h3>
        <DecisionTable decisions={FEELING_STATE_DECISIONS} counts={feelingDecisionCounts} />

        <h3 style={styles.subHeading}>Publication readiness by state</h3>
        <p style={styles.hint}>
          A state is only &ldquo;entries approved&rdquo; when every Duʿā &amp; Dhikr entry it references has an approved decision. This is informational —
          publication still requires separate owner approval and the existing publication gate.
        </p>
        <ul style={styles.list}>
          {feelingReadiness.map(({ state, readiness, review }) => (
            <li key={state.slug} style={styles.listItem}>
              <Link href={`/scholar-review/i-am-feeling/${state.slug}`} style={styles.link}>
                {state.labelEn}
              </Link>
              <span style={styles.muted}>
                {" — "}
                {decisionLabel(FEELING_STATE_DECISIONS, review?.decision)}
                {state.featuredEntries.length === 0 ? " · no content paired" : readiness.ready ? " · entries approved" : ` · ${readiness.blockedByEntryIds.length} entry review(s) pending`}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function countByDecision(decisions: (string | undefined)[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const d of decisions) {
    if (!d) continue;
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  return counts;
}

function DecisionTable({ decisions, counts }: { decisions: readonly { value: string; label: string }[]; counts: Map<string, number> }) {
  return (
    <table style={styles.table}>
      <tbody>
        {decisions.map((d) => (
          <tr key={d.value}>
            <td style={styles.td}>{d.label}</td>
            <td style={{ ...styles.td, textAlign: "right", fontWeight: 600 }}>{counts.get(d.value) ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SummaryStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.statTile}>
      <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0E3B2E" }}>{value}</div>
      <div style={{ fontSize: "0.78rem", color: "#6B6455" }}>{label}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: { margin: 0, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.5rem 0 0.75rem", fontSize: "1.8rem", color: "#0E3B2E" },
  body: { margin: "0 0 1.5rem", color: "#4A4438", lineHeight: 1.6, maxWidth: 720 },
  card: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.5rem", marginBottom: "1.25rem" },
  sectionHeading: { margin: "0 0 1rem", fontSize: "1.15rem", color: "#0E3B2E" },
  subHeading: { margin: "1.5rem 0 0.5rem", fontSize: "0.9rem", color: "#0E3B2E" },
  hint: { fontSize: "0.82rem", color: "#6B6455", margin: "0 0 0.6rem" },
  muted: { color: "#6B6455" },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "0.5rem" },
  statTile: { background: "#F9F6EF", border: "1px solid #EDE7D9", borderRadius: 4, padding: "0.75rem 0.9rem" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" },
  th: { textAlign: "left", padding: "0.4rem 0.5rem", borderBottom: "1px solid #E2DCCF", color: "#6B6455", fontWeight: 600 },
  td: { padding: "0.4rem 0.5rem", borderBottom: "1px solid #F0EBDF" },
  list: { margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" },
  listItem: { fontSize: "0.85rem", padding: "0.4rem 0" },
  link: { color: "#0E3B2E", fontWeight: 600, textDecoration: "none" },
};
