import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionIdFromCookie } from "@/lib/scholar-review/access-control";
import { getDuaDhikrCollectionForReview } from "@/lib/scholar-review/dua-dhikr-review-data";
import { getDuaDhikrCollectionReview, getReviewSession } from "@/lib/scholar-review/review-records";
import { DuaDhikrCollectionReviewForm } from "@/components/scholar-review/DuaDhikrCollectionReviewForm";

export default async function DuaDhikrCollectionDetailPage({ params }: { params: Promise<{ collectionId: string }> }) {
  const { collectionId } = await params;
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null;

  const [collection, review, session] = await Promise.all([
    getDuaDhikrCollectionForReview(collectionId),
    getDuaDhikrCollectionReview(sessionId, collectionId),
    getReviewSession(sessionId),
  ]);
  if (!collection) notFound();

  return (
    <div>
      <Link href="/scholar-review/dua-dhikr/collections" style={styles.backLink}>
        ← Back to collections
      </Link>
      <p style={styles.eyebrow}>Duʿā &amp; Dhikr Collection</p>
      <h1 style={styles.heading}>{collection.titleEn}</h1>
      {collection.reviewStatus && <span style={styles.statusBadge}>Editorial: {collection.reviewStatus}</span>}

      <div style={styles.contentGrid}>
        <section style={styles.contentCard}>
          {collection.introductionEn && (
            <>
              <h2 style={styles.sectionHeading}>Introduction (English)</h2>
              <p style={styles.bodyText}>{collection.introductionEn}</p>
            </>
          )}
          {collection.introductionDa && (
            <>
              <h2 style={styles.sectionHeading}>Introduction (Danish)</h2>
              <p style={styles.bodyText}>{collection.introductionDa}</p>
            </>
          )}
          {collection.descriptionEn && (
            <>
              <h2 style={styles.sectionHeading}>Description</h2>
              <p style={styles.bodyText}>{collection.descriptionEn}</p>
            </>
          )}

          <h2 style={styles.sectionHeading}>Entries in this collection ({collection.entries.length})</h2>
          <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {collection.entries.map((e) => (
              <li key={e._id} style={{ marginBottom: "0.3rem" }}>
                <Link href={`/scholar-review/dua-dhikr/${e._id}`} style={{ color: "#0E3B2E" }}>
                  {e.titleEn}
                </Link>
              </li>
            ))}
            {collection.entries.length === 0 && <li style={{ color: "#9A2B2B" }}>No entries assigned to this collection.</li>}
          </ul>

          {collection.seo?.metaTitle && (
            <>
              <h2 style={styles.sectionHeading}>SEO meta title</h2>
              <p style={styles.bodyText}>{collection.seo.metaTitle}</p>
            </>
          )}
          {collection.seo?.metaDescription && (
            <>
              <h2 style={styles.sectionHeading}>SEO meta description</h2>
              <p style={styles.bodyText}>{collection.seo.metaDescription}</p>
            </>
          )}
        </section>

        <div>
          <DuaDhikrCollectionReviewForm collectionId={collectionId} initial={review} locked={!!session?.duaDhikrProgrammeSubmittedAt} />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backLink: { fontSize: "0.85rem", color: "#0E3B2E", textDecoration: "none" },
  eyebrow: { margin: "1rem 0 0", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.4rem 0 0.6rem", fontSize: "1.6rem", color: "#0E3B2E" },
  statusBadge: { fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E" },
  contentGrid: { display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 1fr)", gap: "1.5rem", alignItems: "start", marginTop: "1.25rem" },
  contentCard: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.5rem" },
  sectionHeading: { fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "#6B6455", margin: "1.1rem 0 0.3rem" },
  bodyText: { fontSize: "0.95rem", lineHeight: 1.6, color: "#20211C", margin: 0 },
};
