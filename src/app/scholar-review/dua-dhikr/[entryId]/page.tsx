import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionIdFromCookie } from "@/lib/scholar-review/access-control";
import { getDuaDhikrEntryForReview, findSuspectedDuplicateEntries } from "@/lib/scholar-review/dua-dhikr-review-data";
import { getDuaDhikrEntryReview, getReviewSession } from "@/lib/scholar-review/review-records";
import { DuaDhikrEntryReviewForm } from "@/components/scholar-review/DuaDhikrEntryReviewForm";

export default async function DuaDhikrEntryDetailPage({ params }: { params: Promise<{ entryId: string }> }) {
  const { entryId } = await params;
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null;

  const [entry, review, duplicateGroups, session] = await Promise.all([
    getDuaDhikrEntryForReview(entryId),
    getDuaDhikrEntryReview(sessionId, entryId),
    findSuspectedDuplicateEntries(),
    getReviewSession(sessionId),
  ]);

  if (!entry) notFound();

  const duplicateGroup = duplicateGroups.find((g) => g.entries.some((e) => e._id === entryId));
  const duplicateCandidates = duplicateGroup ? duplicateGroup.entries.filter((e) => e._id !== entryId) : [];

  return (
    <div>
      <Link href="/scholar-review/dua-dhikr" style={styles.backLink}>
        ← Back to entries
      </Link>
      <p style={styles.eyebrow}>Duʿā &amp; Dhikr Entry</p>
      <h1 style={styles.heading}>{entry.titleEn}</h1>
      <div style={styles.statusRow}>
        {entry.reviewStatus && <span style={styles.statusBadge}>Editorial: {entry.reviewStatus}</span>}
        {entry.editorialPublicationStatus && <span style={styles.statusBadge}>Publication: {entry.editorialPublicationStatus}</span>}
        {entry.importIdentifier && <span style={styles.statusBadgeMuted}>ID: {entry.importIdentifier}</span>}
      </div>

      {duplicateCandidates.length > 0 && (
        <div style={styles.duplicateWarning}>
          <strong>⚠ Suspected duplicate.</strong> This entry shares identical Arabic text with:{" "}
          {duplicateCandidates.map((c, i) => (
            <span key={c._id}>
              {i > 0 && ", "}
              <Link href={`/scholar-review/dua-dhikr/${c._id}`} style={{ color: "#9A6B00", fontWeight: 600 }}>
                {c.titleEn}
              </Link>
            </span>
          ))}
          . Use the &ldquo;Duplicate entry — consolidate&rdquo; decision below to resolve this. No automatic consolidation will happen.
        </div>
      )}

      <div style={styles.contentGrid}>
        <section style={styles.contentCard}>
          <h2 style={styles.sectionHeading}>Arabic text</h2>
          <p dir="rtl" lang="ar" style={styles.arabicText}>
            {entry.arabicText || <em style={styles.missing}>Missing</em>}
          </p>

          <h2 style={styles.sectionHeading}>Transliteration</h2>
          <p style={styles.bodyText}>{entry.transliteration || <em style={styles.missing}>Missing</em>}</p>

          <h2 style={styles.sectionHeading}>Translation (English)</h2>
          <p style={styles.bodyText}>{entry.translationEn || <em style={styles.missing}>Missing</em>}</p>

          <h2 style={styles.sectionHeading}>Translation (Danish)</h2>
          <p style={styles.bodyText}>{entry.translationDa || <em style={styles.missing}>Missing</em>}</p>

          {entry.whatItIsFor && (
            <>
              <h2 style={styles.sectionHeading}>What it is for</h2>
              <p style={styles.bodyText}>{entry.whatItIsFor}</p>
            </>
          )}

          {entry.occasion && entry.occasion.length > 0 && (
            <>
              <h2 style={styles.sectionHeading}>Occasion</h2>
              <p style={styles.bodyText}>{entry.occasion.join(", ")}</p>
            </>
          )}

          <h2 style={styles.sectionHeading}>Virtue</h2>
          <p style={styles.bodyText}>{entry.virtueText || <em style={styles.missing}>Missing</em>}</p>

          <h2 style={styles.sectionHeading}>Explanation</h2>
          <p style={styles.bodyText}>{entry.explanationText || <em style={styles.missing}>Missing</em>}</p>

          {entry.authenticationNote && (
            <>
              <h2 style={styles.sectionHeading}>Authentication note</h2>
              <p style={styles.bodyText}>{entry.authenticationNote}</p>
            </>
          )}

          <h2 style={styles.sectionHeading}>Source references ({entry.sourceReferences.length})</h2>
          {entry.sourceReferences.length === 0 && <p style={styles.missing}>No sources recorded.</p>}
          <ul style={styles.sourceList}>
            {entry.sourceReferences.map((s, i) => (
              <li key={i} style={styles.sourceItem}>
                <div style={{ fontWeight: 600 }}>{s.type ?? "Source"}</div>
                {s.citation && <div>{s.citation}</div>}
                {s.hadithCollection && (
                  <div style={{ color: "#6B6455" }}>
                    {s.hadithCollection} {s.hadithNumber ? `#${s.hadithNumber}` : ""} {s.hadithGrading ? `— ${s.hadithGrading}` : "— no grading recorded"}
                  </div>
                )}
                {(s.surah || s.ayah) && (
                  <div style={{ color: "#6B6455" }}>
                    Surah {s.surah}
                    {s.ayah ? `:${s.ayah}` : ""}
                  </div>
                )}
                {s.verifiedStatus && <div style={{ color: "#6B6455" }}>Verified status: {s.verifiedStatus}</div>}
              </li>
            ))}
          </ul>

          {entry.relatedEntries.length > 0 && (
            <>
              <h2 style={styles.sectionHeading}>Related entries</h2>
              <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                {entry.relatedEntries.map((r) => (
                  <li key={r._id}>
                    <Link href={`/scholar-review/dua-dhikr/${r._id}`} style={{ color: "#0E3B2E" }}>
                      {r.titleEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {entry.editorialNotes && (
            <>
              <h2 style={styles.sectionHeading}>Internal editorial notes</h2>
              <p style={styles.bodyText}>{entry.editorialNotes}</p>
            </>
          )}
        </section>

        <div>
          <DuaDhikrEntryReviewForm entryId={entryId} initial={review} duplicateCandidates={duplicateCandidates} locked={!!session?.duaDhikrProgrammeSubmittedAt} />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backLink: { fontSize: "0.85rem", color: "#0E3B2E", textDecoration: "none" },
  eyebrow: { margin: "1rem 0 0", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.4rem 0 0.6rem", fontSize: "1.6rem", color: "#0E3B2E" },
  statusRow: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" },
  statusBadge: { fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E" },
  statusBadgeMuted: { fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 3, background: "#F0EBDF", color: "#6B6455" },
  duplicateWarning: { background: "#FFF7E5", border: "1px solid #E9CE8A", borderRadius: 4, padding: "0.9rem 1rem", marginBottom: "1.25rem", fontSize: "0.88rem", color: "#4A4438" },
  contentGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 1fr)", gap: "1.5rem", alignItems: "start" },
  contentCard: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.5rem" },
  sectionHeading: { fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#6B6455", margin: "1.1rem 0 0.3rem" },
  arabicText: { fontSize: "1.6rem", lineHeight: 2, color: "#20211C", margin: 0 },
  bodyText: { fontSize: "0.95rem", lineHeight: 1.6, color: "#20211C", margin: 0 },
  missing: { color: "#9A2B2B" },
  sourceList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" },
  sourceItem: { fontSize: "0.88rem", padding: "0.6rem 0.75rem", background: "#F9F6EF", border: "1px solid #EDE7D9", borderRadius: 3 },
};
