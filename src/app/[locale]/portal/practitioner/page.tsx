import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { DepartmentNav } from "@/components/ui/DepartmentNav";
import { ListingRow } from "@/components/ui/Attestation";
import { Link } from "@/i18n/navigation";
import { practitionerPortal } from "@/lib/navigation/practitioner-portal";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";
import { getPractitionerDashboard } from "@/modules/practitioner/dashboard";

export const metadata: Metadata = {
  title: "Practitioner Portal",
  description: "Clinical protocols, CPD, credentials, and practice resources",
};

export default async function PractitionerDashboardPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requirePractitionerPortal();
  const dashboard = await getPractitionerDashboard(session.accountId, locale);

  const cpdTarget = dashboard.cpd.cycle.targetCredits;
  const cpdAccrued = dashboard.cpd.cycle.accruedCredits;

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Practitioner Portal"
            folio="i"
            title={`Welcome, ${dashboard.account?.account.displayName ?? "Practitioner"}`}
            lede="Your professional workspace — institutional guidance, CPD, and verified credentials"
          >
            <p>
              Clinical protocols here are faculty-reviewed and distinct from peer
              discussion elsewhere in the community
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <div className="section-page__layout">
            <aside className="section-page__nav">
              <DepartmentNav department={practitionerPortal} currentHref="/portal/practitioner" />
            </aside>
            <div className="section-page__body">
              {dashboard.announcements.length > 0 && (
                <section className="policy-block">
                  <h2 className="type-title">Practice updates</h2>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {dashboard.announcements.map((a) => (
                      <li key={a._id} className="type-body" style={{ marginBottom: "var(--s3)" }}>
                        {a.message}
                        {a.link?.href && (
                          <>
                            {" "}
                            <Link href={a.link.href} className="quiet-link">
                              {a.link.label ?? "Read"}
                            </Link>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <aside
                className="monograph-ledger programme-ledger"
                aria-label="CPD summary"
                style={{ marginBottom: "var(--s6)" }}
              >
                <div className="monograph-ledger__inner">
                  <p className="type-eyebrow monograph-ledger__label">CPD ledger</p>
                  <p className="type-title monograph-ledger__name">
                    {cpdAccrued} of {cpdTarget} credits
                  </p>
                  <p className="type-micro monograph-ledger__measure">
                    {new Date().getFullYear()} cycle
                  </p>
                  <Link href="/portal/practitioner/cpd" className="solid-action programme-ledger__cta">
                    View CPD record
                  </Link>
                </div>
              </aside>

              <section className="policy-block">
                <h2 className="type-title">Clinical protocols</h2>
                {dashboard.recentProtocols.map((p) => (
                  <ListingRow
                    key={p._id}
                    title={p.title}
                    provenance={p.reviewedByName ?? "Faculty reviewed"}
                    href={`/portal/practitioner/protocols/${p.slug}`}
                    subtitle={p.version ? `Version ${p.version}` : undefined}
                  />
                ))}
                <Link href="/portal/practitioner/protocols" className="go-link">
                  All protocols
                  <span aria-hidden="true">→</span>
                </Link>
              </section>

              <section className="policy-block">
                <h2 className="type-title">Recent downloads</h2>
                {dashboard.recentResources.length === 0 ? (
                  <p className="type-body">No downloads published yet</p>
                ) : (
                  dashboard.recentResources.map((r) => (
                    <ListingRow
                      key={r._id}
                      title={r.title}
                      provenance={r.resourceType.replace(/-/g, " ")}
                      href={`/portal/practitioner/downloads#${r.slug}`}
                    />
                  ))
                )}
                <Link href="/portal/practitioner/downloads" className="go-link">
                  All downloads
                  <span aria-hidden="true">→</span>
                </Link>
              </section>

              <section className="policy-block">
                <h2 className="type-title">Credentials</h2>
                <p className="type-body">
                  {dashboard.credentials.practitionerVerified
                    ? "Practitioner verification active"
                    : "Verification pending or not yet submitted"}
                </p>
                <p className="type-micro" style={{ color: "var(--muted)" }}>
                  {dashboard.credentials.certificates.length} certificate
                  {dashboard.credentials.certificates.length === 1 ? "" : "s"} on record
                </p>
                <Link href="/portal/practitioner/credentials" className="go-link">
                  View digital credentials
                  <span aria-hidden="true">→</span>
                </Link>
              </section>
            </div>
          </div>
        </div>
      </Leaf>
    </>
  );
}
