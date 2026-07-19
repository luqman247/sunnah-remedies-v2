import Link from "next/link";
import { getSessionIdFromCookie } from "@/lib/scholar-review/access-control";
import { listDuaDhikrCollectionsForReview } from "@/lib/scholar-review/dua-dhikr-review-data";
import { listDuaDhikrCollectionReviews } from "@/lib/scholar-review/review-records";
import { DUA_DHIKR_COLLECTION_DECISIONS, decisionLabel } from "@/lib/scholar-review/decision-labels";

export default async function DuaDhikrCollectionListPage() {
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null;

  const [collections, reviews] = await Promise.all([listDuaDhikrCollectionsForReview(), listDuaDhikrCollectionReviews(sessionId)]);
  const reviewByCollection = new Map(reviews.map((r) => [r.collectionId, r]));

  return (
    <div>
      <Link href="/scholar-review/dua-dhikr" style={styles.backLink}>
        ← Back to entries
      </Link>
      <p style={styles.eyebrow}>Duʿā &amp; Dhikr Library</p>
      <h1 style={styles.heading}>Collections ({collections.length})</h1>
      <p style={styles.body}>Review how entries are grouped, ordered, and introduced within each collection.</p>

      <div style={styles.list}>
        {collections.map((c) => {
          const review = reviewByCollection.get(c._id);
          return (
            <Link key={c._id} href={`/scholar-review/dua-dhikr/collections/${c._id}`} style={styles.row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: "#20211C" }}>{c.titleEn}</div>
                <div style={{ fontSize: "0.8rem", color: "#6B6455", marginTop: "0.15rem" }}>
                  {c.entryCount} entr{c.entryCount === 1 ? "y" : "ies"}
                  {c.parentGroup ? ` · ${c.parentGroup}` : ""}
                </div>
              </div>
              <span style={review?.decision ? styles.decisionBadge : styles.decisionBadgeEmpty}>{decisionLabel(DUA_DHIKR_COLLECTION_DECISIONS, review?.decision)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backLink: { fontSize: "0.85rem", color: "#0E3B2E", textDecoration: "none" },
  eyebrow: { margin: "1rem 0 0", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.4rem 0 0.6rem", fontSize: "1.6rem", color: "#0E3B2E" },
  body: { margin: "0 0 1.25rem", color: "#4A4438", lineHeight: 1.6, maxWidth: 720 },
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
  decisionBadge: { fontSize: "0.78rem", padding: "0.3rem 0.65rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E", whiteSpace: "nowrap" },
  decisionBadgeEmpty: { fontSize: "0.78rem", padding: "0.3rem 0.65rem", borderRadius: 3, background: "#F0EBDF", color: "#6B6455", whiteSpace: "nowrap" },
};
