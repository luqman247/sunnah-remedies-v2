import Link from "next/link";
import { getSessionIdFromCookie } from "@/lib/scholar-review/access-control";
import { listDuaDhikrEntriesForReview, findSuspectedDuplicateEntries } from "@/lib/scholar-review/dua-dhikr-review-data";
import { listDuaDhikrEntryReviews } from "@/lib/scholar-review/review-records";
import { DUA_DHIKR_ENTRY_DECISIONS, decisionLabel } from "@/lib/scholar-review/decision-labels";

type FilterKey = "all" | "unreviewed" | "approved" | "changes" | "verification" | "unpublished" | "duplicates";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unreviewed", label: "Not yet reviewed" },
  { key: "approved", label: "Approved" },
  { key: "changes", label: "Requiring changes" },
  { key: "verification", label: "Verification required" },
  { key: "unpublished", label: "Kept unpublished / rejected" },
  { key: "duplicates", label: "Suspected duplicates" },
];

const APPROVED = new Set(["approved", "approved-with-arabic-correction", "approved-with-translation-revision", "approved-with-transliteration-revision", "approved-with-source-correction"]);
const CHANGES = new Set(["approved-with-arabic-correction", "approved-with-translation-revision", "approved-with-transliteration-revision", "approved-with-source-correction"]);
const VERIFICATION = new Set(["additional-source-verification-required", "hadith-grading-required"]);
const UNPUBLISHED = new Set(["keep-unpublished", "reject-entry"]);

export default async function DuaDhikrEntryListPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sessionId = await getSessionIdFromCookie();
  if (!sessionId) return null;

  const params = await searchParams;
  const filter = (params.filter as FilterKey) ?? "all";
  const q = (params.q ?? "").trim().toLowerCase();

  const [entries, reviews, duplicateGroups] = await Promise.all([
    listDuaDhikrEntriesForReview(),
    listDuaDhikrEntryReviews(sessionId),
    findSuspectedDuplicateEntries(),
  ]);

  const reviewByEntry = new Map(reviews.map((r) => [r.entryId, r]));
  const duplicateEntryIds = new Set(duplicateGroups.flatMap((g) => g.entries.map((e) => e._id)));

  let filtered = entries;
  if (q) filtered = filtered.filter((e) => e.titleEn.toLowerCase().includes(q));
  if (filter !== "all") {
    filtered = filtered.filter((e) => {
      const decision = reviewByEntry.get(e._id)?.decision;
      switch (filter) {
        case "unreviewed":
          return !decision;
        case "approved":
          return decision ? APPROVED.has(decision) : false;
        case "changes":
          return decision ? CHANGES.has(decision) : false;
        case "verification":
          return decision ? VERIFICATION.has(decision) : false;
        case "unpublished":
          return decision ? UNPUBLISHED.has(decision) : false;
        case "duplicates":
          return duplicateEntryIds.has(e._id);
        default:
          return true;
      }
    });
  }

  return (
    <div>
      <p style={styles.eyebrow}>Duʿā &amp; Dhikr Library</p>
      <h1 style={styles.heading}>Entries ({entries.length})</h1>
      <p style={styles.body}>
        Every entry currently in the staging Knowledge Library. Select an entry to review its full content and record a decision.
      </p>

      <form method="get" style={styles.searchRow}>
        <input type="text" name="q" defaultValue={params.q ?? ""} placeholder="Search by title…" style={styles.searchInput} />
        {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>

      <nav style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={{ pathname: "/scholar-review/dua-dhikr", query: { ...(params.q ? { q: params.q } : {}), ...(f.key !== "all" ? { filter: f.key } : {}) } }}
            style={f.key === filter ? styles.filterActive : styles.filterLink}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      <p style={{ fontSize: "0.85rem", color: "#6B6455", margin: "0.75rem 0" }}>
        Showing {filtered.length} of {entries.length} entries
      </p>

      <div style={styles.list}>
        {filtered.map((entry) => {
          const review = reviewByEntry.get(entry._id);
          const isDuplicate = duplicateEntryIds.has(entry._id);
          return (
            <Link key={entry._id} href={`/scholar-review/dua-dhikr/${entry._id}`} style={styles.row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: "#20211C" }}>
                  {entry.titleEn}
                  {isDuplicate && <span style={styles.duplicateBadge}>⚠ possible duplicate</span>}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6B6455", marginTop: "0.15rem" }}>
                  {entry.collections.map((c) => c.titleEn).join(", ") || "No collection"}
                  {" · "}
                  {entry.sourceCount} source{entry.sourceCount === 1 ? "" : "s"}
                  {!entry.hasGrading && " · no grading"}
                  {entry.hasPlaceholderCitation && " · placeholder citation"}
                </div>
              </div>
              <span style={review?.decision ? styles.decisionBadge : styles.decisionBadgeEmpty}>{decisionLabel(DUA_DHIKR_ENTRY_DECISIONS, review?.decision)}</span>
            </Link>
          );
        })}
        {filtered.length === 0 && <p style={{ color: "#6B6455" }}>No entries match this filter.</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: { margin: 0, fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#C7A25A" },
  heading: { margin: "0.5rem 0 0.75rem", fontSize: "1.6rem", color: "#0E3B2E" },
  body: { margin: "0 0 1.25rem", color: "#4A4438", lineHeight: 1.6, maxWidth: 720 },
  searchRow: { display: "flex", gap: "0.5rem", marginBottom: "0.9rem" },
  searchInput: { flex: 1, maxWidth: 320, padding: "0.5rem 0.7rem", border: "1px solid #C9C2B1", borderRadius: 3, fontSize: "0.9rem" },
  searchButton: { padding: "0.5rem 1rem", border: "1px solid #C9C2B1", borderRadius: 3, background: "#FFFFFF", cursor: "pointer", fontSize: "0.9rem" },
  filterRow: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" },
  filterLink: { fontSize: "0.82rem", padding: "0.35rem 0.75rem", borderRadius: 20, border: "1px solid #C9C2B1", color: "#4A4438", textDecoration: "none" },
  filterActive: { fontSize: "0.82rem", padding: "0.35rem 0.75rem", borderRadius: 20, border: "1px solid #0E3B2E", background: "#0E3B2E", color: "#F6F3EE", textDecoration: "none" },
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
  duplicateBadge: { marginLeft: "0.6rem", fontSize: "0.72rem", color: "#9A6B00", fontWeight: 600 },
  decisionBadge: { fontSize: "0.78rem", padding: "0.3rem 0.65rem", borderRadius: 3, background: "#EAF2EC", color: "#0E3B2E", whiteSpace: "nowrap" },
  decisionBadgeEmpty: { fontSize: "0.78rem", padding: "0.3rem 0.65rem", borderRadius: 3, background: "#F0EBDF", color: "#6B6455", whiteSpace: "nowrap" },
};
