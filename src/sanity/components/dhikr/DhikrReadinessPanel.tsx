import type { UserViewComponent } from "sanity/structure";
import {
  getDhikrEligibilityConditions,
  isDhikrItemPubliclyEligible,
  type DhikrItemEligibilityInput,
} from "@/sanity/lib/dhikr-publication-gate";

/**
 * Dhikr Item — Publication Readiness panel (Stage 2B).
 *
 * A read-only custom Studio document view, registered in
 * src/sanity/structure/index.ts as a second view ("Publication Readiness")
 * alongside the normal form view for dhikrItem documents only.
 *
 * Every canonical condition rendered here comes from a single call to
 * getDhikrEligibilityConditions() (src/sanity/lib/dhikr-publication-gate.ts)
 * — the seven conditions are never re-derived or hand-copied. The advisory
 * section below is deliberately computed separately and labelled as
 * non-canonical, so it can never be mistaken for a publication requirement.
 *
 * No mutation of any kind happens here: no field is written, no button
 * changes reviewStatus or boardApprovals, and no Publish action is invoked
 * or wrapped. This component only reads props Sanity already provides.
 *
 * Plain HTML/CSS, no @sanity/ui — same architectural choice already made in
 * src/sanity/tools/operations-overview.tsx, for the same reason (avoid a
 * dependency on Sanity's internal UI library).
 *
 * Prop shape and the document.displayed field are Sanity's own documented
 * UserViewComponent contract (sanity@6.3.0, verified directly against the
 * installed package's type declarations before writing this component) —
 * not guessed. document.displayed is "whichever version (draft or
 * published) is currently shown," which is exactly what a read-only
 * readiness view should reflect.
 */

interface AdvisoryCheck {
  label: string;
  present: boolean;
}

function getAdvisoryChecks(doc: Partial<Record<string, unknown>>): AdvisoryCheck[] {
  const slug = doc.slug as { current?: string } | undefined;
  const category = doc.category as { _ref?: string } | undefined;
  return [
    { label: "Slug configured", present: !!slug?.current },
    { label: "Category selected", present: !!category?._ref },
    { label: "English title present", present: !!doc.titleEn },
    { label: "Danish title present", present: !!doc.titleDa },
    { label: "Transliteration present", present: !!doc.transliteration },
    { label: "Repetition guidance present", present: !!doc.recommendedRepetitions },
    { label: "Audio present", present: !!doc.audioAsset },
  ];
}

const REVIEW_STATUS_LABELS: Record<string, string> = {
  sourced: "Sourced",
  "scholarly-review": "Scholarly Review",
  "editorial-review": "Editorial Review",
  approved: "Approved",
  published: "Published",
};

const DhikrReadinessPanel: UserViewComponent = (props) => {
  const doc = props.document.displayed ?? {};
  const eligibilityInput = doc as DhikrItemEligibilityInput;
  const conditions = getDhikrEligibilityConditions(eligibilityInput);
  const overallEligible = isDhikrItemPubliclyEligible(eligibilityInput);
  const reviewStatus = (doc.reviewStatus as string | undefined) ?? "—";
  const reviewStatusLabel = REVIEW_STATUS_LABELS[reviewStatus] ?? reviewStatus;
  const advisoryChecks = getAdvisoryChecks(doc);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Publication Readiness</h1>
      <p style={styles.muted}>
        Read-only. Reflects the currently displayed version of this document — no field here can be edited, and
        nothing on this panel changes reviewStatus, board approvals, or any other field.
      </p>

      <section style={styles.section} aria-labelledby="dhikr-readiness-status-heading">
        <h2 id="dhikr-readiness-status-heading" style={styles.sectionHeading}>
          Current status
        </h2>
        <dl style={styles.statusList}>
          <div style={styles.statusRow}>
            <dt style={styles.statusTerm}>Review status</dt>
            <dd style={styles.statusValue}>{reviewStatusLabel}</dd>
          </div>
          <div style={styles.statusRow}>
            <dt style={styles.statusTerm}>Publicly eligible right now</dt>
            <dd style={styles.statusValue}>{overallEligible ? "Yes" : "No"}</dd>
          </div>
        </dl>
      </section>

      <section style={styles.section} aria-labelledby="dhikr-readiness-canonical-heading">
        <h2 id="dhikr-readiness-canonical-heading" style={styles.sectionHeading}>
          Canonical publication conditions
        </h2>
        <p style={styles.muted}>
          All seven conditions below are required, together, before this item can become publicly visible. This
          list is generated directly from the canonical gate in src/sanity/lib/dhikr-publication-gate.ts — it is
          not a separate or restated copy of that rule.
        </p>
        <ul style={styles.conditionList}>
          {conditions.map((condition) => (
            <li key={condition.key} style={styles.conditionRow}>
              <span style={styles.conditionLabel}>{condition.label}</span>
              <span style={condition.met ? styles.badgeMet : styles.badgeMissing}>
                {condition.met ? "Met" : "Missing"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.section} aria-labelledby="dhikr-readiness-advisory-heading">
        <h2 id="dhikr-readiness-advisory-heading" style={styles.sectionHeading}>
          Advisory checks
        </h2>
        <p style={styles.muted}>
          Recommended or Studio-level checks — not part of the canonical public eligibility gate. None of the
          fields below are required for publication.
        </p>
        <ul style={styles.conditionList}>
          {advisoryChecks.map((check) => (
            <li key={check.label} style={styles.conditionRow}>
              <span style={styles.conditionLabel}>{check.label}</span>
              <span style={check.present ? styles.badgeAdvisoryPresent : styles.badgeAdvisoryRecommended}>
                {check.present ? "Present" : "Recommended"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DhikrReadinessPanel;

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "2rem",
    maxWidth: "42rem",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: "0.875rem",
    color: "#1a1a1a",
  },
  heading: {
    fontSize: "1.25rem",
    fontWeight: 500,
    marginBottom: "0.25rem",
  },
  muted: {
    color: "#6b7280",
    fontSize: "0.8125rem",
    lineHeight: 1.5,
  },
  section: {
    marginTop: "2rem",
    padding: "1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
  },
  sectionHeading: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
    marginBottom: "0.5rem",
    color: "#374151",
  },
  statusList: {
    margin: "0.75rem 0 0",
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.35rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  statusTerm: {
    fontWeight: 500,
    margin: 0,
  },
  statusValue: {
    margin: 0,
    color: "#374151",
  },
  conditionList: {
    listStyle: "none",
    padding: 0,
    margin: "0.75rem 0 0",
  },
  conditionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.45rem 0",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "0.8125rem",
  },
  conditionLabel: {
    flex: 1,
  },
  badgeMet: {
    display: "inline-block",
    padding: "0.1rem 0.5rem",
    borderRadius: "2px",
    fontSize: "0.6875rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.02em",
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #166534",
    flexShrink: 0,
  },
  badgeMissing: {
    display: "inline-block",
    padding: "0.1rem 0.5rem",
    borderRadius: "2px",
    fontSize: "0.6875rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.02em",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #991b1b",
    flexShrink: 0,
  },
  badgeAdvisoryPresent: {
    display: "inline-block",
    padding: "0.1rem 0.5rem",
    borderRadius: "2px",
    fontSize: "0.6875rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.02em",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #9ca3af",
    flexShrink: 0,
  },
  badgeAdvisoryRecommended: {
    display: "inline-block",
    padding: "0.1rem 0.5rem",
    borderRadius: "2px",
    fontSize: "0.6875rem",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.02em",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    border: "1px solid #92400e",
    flexShrink: 0,
  },
};
