"use client";

import { useEffect, useState } from "react";
import { useClient } from "sanity";

/**
 * Operations Overview — a custom Sanity Studio tool.
 *
 * Surfaces operational information staff need at a glance:
 * - Articles approaching their next review date
 * - Compliance entries nearing renewal
 * - Open audit findings
 *
 * Architectural decision: uses plain HTML/CSS rather than @sanity/ui to avoid
 * dependency on Sanity's internal UI library which is bundled as a nested dep
 * and may change between versions. Plain HTML is maximally durable.
 *
 * @see Phase 4, Chapter 13.3 — Audit calendar
 * @see Phase 4, Chapter 04.2 — Compliance register
 */

interface ReviewItem {
  _id: string;
  title: string;
  nextReviewDate: string;
}

interface ComplianceItem {
  _id: string;
  obligation: string;
  status: string;
  renewalDate: string;
}

interface AuditItem {
  _id: string;
  finding: string;
  severity: string;
  status: string;
  date: string;
}

export function OperationsOverview() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [reviewsDue, setReviewsDue] = useState<ReviewItem[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceItem[]>([]);
  const [openFindings, setOpenFindings] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        const [reviews, compliance, findings] = await Promise.all([
          client.fetch<ReviewItem[]>(
            `*[_type == "article" && defined(nextReviewDate) && nextReviewDate <= $threshold] | order(nextReviewDate asc) [0...10] {
            _id, title, nextReviewDate
          }`,
            { threshold: thirtyDays }
          ),
          client.fetch<ComplianceItem[]>(
            `*[_type == "complianceEntry" && (status == "amber" || status == "red" || (defined(renewalDate) && renewalDate <= $threshold))] | order(renewalDate asc) [0...10] {
            _id, obligation, status, renewalDate
          }`,
            { threshold: thirtyDays }
          ),
          client.fetch<AuditItem[]>(
            `*[_type == "auditFinding" && status in ["open", "in-progress"]] | order(severity asc, date desc) [0...10] {
            _id, finding, severity, status, date
          }`
          ),
        ]);

        setReviewsDue(reviews);
        setComplianceAlerts(compliance);
        setOpenFindings(findings);
      } catch {
        setError("Unable to load operational data. Check your connection and permissions.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [client]);

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.muted}>Loading operations overview…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={{ ...styles.muted, color: "#991b1b" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Operations Overview</h1>
      <p style={styles.muted}>
        Upcoming review dates, compliance alerts, and open findings.
      </p>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Content Reviews Due (next 30 days)</h2>
        {reviewsDue.length === 0 ? (
          <p style={styles.muted}>No reviews due.</p>
        ) : (
          <ul style={styles.list}>
            {reviewsDue.map((item) => (
              <li key={item._id} style={styles.listItem}>
                <span>{item.title}</span>
                <span style={styles.date}>{item.nextReviewDate}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Compliance Alerts</h2>
        {complianceAlerts.length === 0 ? (
          <p style={styles.muted}>All entries green.</p>
        ) : (
          <ul style={styles.list}>
            {complianceAlerts.map((item) => (
              <li key={item._id} style={styles.listItem}>
                <span style={{
                  ...styles.badge,
                  backgroundColor: item.status === "red" ? "#fee2e2" : "#fef3c7",
                  color: item.status === "red" ? "#991b1b" : "#92400e",
                }}>
                  {item.status}
                </span>
                <span style={{ flex: 1 }}>{item.obligation}</span>
                <span style={styles.date}>{item.renewalDate || "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionHeading}>Open Audit Findings</h2>
        {openFindings.length === 0 ? (
          <p style={styles.muted}>No open findings.</p>
        ) : (
          <ul style={styles.list}>
            {openFindings.map((item) => (
              <li key={item._id} style={styles.listItem}>
                <span style={{
                  ...styles.badge,
                  backgroundColor:
                    item.severity === "critical" ? "#fee2e2" :
                    item.severity === "major" ? "#fef3c7" : "#f3f4f6",
                  color:
                    item.severity === "critical" ? "#991b1b" :
                    item.severity === "major" ? "#92400e" : "#374151",
                }}>
                  {item.severity}
                </span>
                <span style={{ flex: 1 }}>
                  {item.finding && item.finding.length > 80
                    ? item.finding.substring(0, 80) + "…"
                    : item.finding}
                </span>
                <span style={styles.date}>{item.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "2rem",
    maxWidth: "64rem",
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
    marginBottom: "0.75rem",
    color: "#374151",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.4rem 0",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "0.8125rem",
  },
  date: {
    color: "#6b7280",
    fontSize: "0.75rem",
    whiteSpace: "nowrap" as const,
  },
  badge: {
    display: "inline-block",
    padding: "0.1rem 0.4rem",
    borderRadius: "2px",
    fontSize: "0.6875rem",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.02em",
    flexShrink: 0,
  },
};
