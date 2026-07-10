/**
 * Institution Dashboard — executive intelligence view.
 *
 * Protected internal route showing real-time institutional health.
 * Every commercial metric is paired with its integrity metric
 * (two-ledger rule enforced structurally).
 *
 * Auth: behind next-auth middleware (staff routes).
 * Data: server-side reads from warehouse/aggregated marts.
 */

import { fetchDashboardData } from "../../../../analytics/dashboard/api/data";
import {
  RealtimeStripTiles,
  CommercialLedgerTiles,
  IntegrityLedgerTiles,
  KnowledgeDiscoveryTiles,
  OperationalHealthTiles,
} from "../../../../analytics/dashboard/components/tiles";

export const metadata = {
  title: "Institution Dashboard — Sunnah Remedies",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function IntelligenceDashboard() {
  const data = await fetchDashboardData();

  return (
    <div
      style={{
        maxWidth: "90rem",
        margin: "0 auto",
        padding: "2rem",
        fontFamily: "var(--font-utility, monospace)",
        color: "var(--color-text, warm-ivory)",
        backgroundColor: "var(--color-surface, #111122)",
        minHeight: "100vh",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--color-border, #C7A25A)",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display, serif)",
              fontSize: "1.5rem",
              fontWeight: 400,
              letterSpacing: "0.04em",
              margin: 0,
            }}
          >
            Institutional Intelligence
          </h1>
          <p
            style={{
              fontSize: "0.75rem",
              opacity: 0.5,
              margin: "0.25rem 0 0",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Sunnah Remedies — Executive Overview
          </p>
        </div>
        <span style={{ fontSize: "0.6875rem", opacity: 0.4 }}>
          Updated {new Date(data.lastUpdated).toLocaleTimeString("en-GB")}
        </span>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        <RealtimeStripTiles data={data.realtime} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
          }}
        >
          <CommercialLedgerTiles data={data.commercial} />
          <IntegrityLedgerTiles data={data.integrity} />
        </div>

        <KnowledgeDiscoveryTiles data={data.knowledge} />
        <OperationalHealthTiles data={data.operational} />
      </div>
    </div>
  );
}
