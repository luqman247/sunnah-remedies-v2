/**
 * Dashboard tiles — two-ledger-enforced display components.
 *
 * Every commercial tile is paired with its integrity tile.
 * Uses existing design tokens for visual consistency.
 * Internal surface only — never rendered to public visitors.
 */

import type {
  RealtimeStrip,
  CommercialLedger,
  IntegrityLedger,
  KnowledgeDiscovery,
  OperationalHealth,
} from "../api/data";

/* ── Shared styles ─────────────────────────────────────────────── */

const tileStyle: React.CSSProperties = {
  padding: "1.25rem",
  border: "1px solid var(--color-border, #2a2a3e)",
  borderRadius: "2px",
  backgroundColor: "var(--color-surface-raised, #1e1e32)",
  fontFamily: "var(--font-utility, monospace)",
  fontSize: "0.8125rem",
  color: "var(--color-text, #F6F3EE)",
};

const valueStyle: React.CSSProperties = {
  fontFamily: "var(--font-display, serif)",
  fontSize: "2rem",
  fontWeight: 400,
  lineHeight: 1.1,
  marginTop: "0.5rem",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.6875rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  opacity: 0.65,
};

const sectionHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display, serif)",
  fontSize: "1rem",
  fontWeight: 400,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  borderBottom: "1px solid var(--color-border, #C7A25A)",
  paddingBottom: "0.5rem",
  marginBottom: "1rem",
  opacity: 0.8,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
};

/* ── Realtime Strip ────────────────────────────────────────────── */

export function RealtimeStripTiles({ data }: { data: RealtimeStrip }) {
  return (
    <section>
      <div style={{ ...gridStyle, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <Tile label="Visitors today" value={data.visitorsToday} />
        <Tile label="Active users" value={data.activeUsers} />
        <Tile label="Orders" value={data.ordersToday} />
        <Tile label="Revenue" value={formatCurrency(data.revenueToday)} />
        <Tile label="Appointments" value={data.appointmentsToday} />
        <Tile label="AI conversations" value={data.aiConversationsToday} />
      </div>
    </section>
  );
}

/* ── Commercial Ledger ─────────────────────────────────────────── */

export function CommercialLedgerTiles({ data }: { data: CommercialLedger }) {
  return (
    <section>
      <h3 style={sectionHeadingStyle}>Commercial Ledger</h3>
      <div style={gridStyle}>
        <Tile label="Revenue (7d)" value={formatCurrency(data.revenueThisWeek)} />
        <Tile label="Avg order value" value={formatCurrency(data.averageOrderValue)} />
        <Tile label="Cart abandonment" value={formatPercent(data.cartAbandonmentRate)} />
        <Tile label="Refund rate" value={formatPercent(data.refundRate)} ledger="integrity-guard" />
      </div>
      {data.topProducts.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <span style={labelStyle}>Top products</span>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
            {data.topProducts.slice(0, 5).map((p) => (
              <li key={p.name} style={{ fontSize: "0.8125rem", marginBottom: "0.25rem" }}>
                {p.name} — {p.purchases} sold, {formatCurrency(p.revenue)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/* ── Integrity Ledger ──────────────────────────────────────────── */

export function IntegrityLedgerTiles({ data }: { data: IntegrityLedger }) {
  return (
    <section>
      <h3 style={sectionHeadingStyle}>Integrity Ledger</h3>
      <div style={gridStyle}>
        <Tile label="Course completion" value={formatPercent(data.courseCompletionRate)} />
        <Tile label="AI trust score" value={formatPercent(data.aiTrustScore)} />
        <Tile label="AI citation rate" value={formatPercent(data.aiCitationRate)} />
        <Tile
          label="Uncited claims"
          value={formatPercent(data.aiUncitedClaimRate)}
          alert={data.aiUncitedClaimRate > 0.15}
        />
      </div>
      <div style={{ ...gridStyle, marginTop: "1rem" }}>
        <Tile label="Articles (fresh)" value={data.editorialHealth.freshCount} />
        <Tile
          label="Due review"
          value={data.editorialHealth.dueReviewCount}
          alert={data.editorialHealth.dueReviewCount > 0}
        />
        <Tile
          label="Stale"
          value={data.editorialHealth.staleCount}
          alert={data.editorialHealth.staleCount > 0}
        />
        <Tile label="Avg reading time" value={`${data.researchEngagement.averageReadingTime}s`} />
      </div>
    </section>
  );
}

/* ── Knowledge & Discovery ─────────────────────────────────────── */

export function KnowledgeDiscoveryTiles({ data }: { data: KnowledgeDiscovery }) {
  return (
    <section>
      <h3 style={sectionHeadingStyle}>Knowledge & Discovery</h3>
      <div style={gridStyle}>
        <div style={tileStyle}>
          <span style={labelStyle}>Popular searches</span>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
            {data.popularSearches.length === 0 && (
              <li style={{ opacity: 0.5, fontSize: "0.8125rem" }}>Awaiting data</li>
            )}
            {data.popularSearches.slice(0, 8).map((s) => (
              <li key={s.term} style={{ fontSize: "0.8125rem", marginBottom: "0.125rem" }}>
                {s.term} <span style={{ opacity: 0.5 }}>({s.count})</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={tileStyle}>
          <span style={{ ...labelStyle, color: data.failedSearches.length > 0 ? "#c75a5a" : undefined }}>
            Failed searches
          </span>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
            {data.failedSearches.length === 0 && (
              <li style={{ opacity: 0.5, fontSize: "0.8125rem" }}>None</li>
            )}
            {data.failedSearches.slice(0, 8).map((s) => (
              <li key={s.term} style={{ fontSize: "0.8125rem", marginBottom: "0.125rem" }}>
                {s.term} <span style={{ opacity: 0.5 }}>({s.count})</span>
              </li>
            ))}
          </ul>
        </div>
        <Tile label="Entities" value={data.knowledgeGraphGrowth.entities} />
        <Tile label="New this week" value={data.knowledgeGraphGrowth.newThisWeek} />
      </div>
    </section>
  );
}

/* ── Operational Health ────────────────────────────────────────── */

export function OperationalHealthTiles({ data }: { data: OperationalHealth }) {
  const statusColor =
    data.systemStatus === "healthy" ? "#5ac77a" :
    data.systemStatus === "degraded" ? "#c7a25a" : "#c75a5a";

  return (
    <section>
      <h3 style={sectionHeadingStyle}>Operational Health</h3>
      <div style={gridStyle}>
        <Tile label="LCP p75" value={`${data.coreWebVitals.lcp}ms`} alert={data.coreWebVitals.lcp > 2500} />
        <Tile label="INP p75" value={`${data.coreWebVitals.inp}ms`} alert={data.coreWebVitals.inp > 200} />
        <Tile label="CLS p75" value={data.coreWebVitals.cls.toFixed(3)} alert={data.coreWebVitals.cls > 0.1} />
        <Tile label="Uptime" value={formatPercent(data.uptime / 100)} />
        <Tile label="Error rate" value={formatPercent(data.errorRate)} alert={data.errorRate > 0.01} />
        <div style={{ ...tileStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: statusColor, display: "inline-block" }} />
          <span style={labelStyle}>System: {data.systemStatus}</span>
        </div>
      </div>
    </section>
  );
}

/* ── Base Tile ─────────────────────────────────────────────────── */

function Tile({
  label,
  value,
  alert,
  ledger,
}: {
  label: string;
  value: string | number;
  alert?: boolean;
  ledger?: "integrity-guard";
}) {
  return (
    <div
      style={{
        ...tileStyle,
        ...(alert && { borderColor: "#c75a5a" }),
        ...(ledger === "integrity-guard" && { borderLeftColor: "#c7a25a", borderLeftWidth: 3 }),
      }}
    >
      <span style={labelStyle}>{label}</span>
      <div style={{ ...valueStyle, ...(alert && { color: "#c75a5a" }) }}>{value}</div>
    </div>
  );
}

/* ── Formatters ────────────────────────────────────────────────── */

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
