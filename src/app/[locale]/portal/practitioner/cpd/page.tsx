import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";
import { getCpdSummary, getCpdRecords } from "@/modules/practitioner/cpd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.practitioner.cpd", "/portal/practitioner/cpd");
}

function formatCategory(key: string) {
  return key.replace(/_/g, " ");
}

export default async function CpdPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requirePractitionerPortal("/portal/practitioner/cpd");
  const [summary, records] = await Promise.all([
    getCpdSummary(session.accountId),
    getCpdRecords(session.accountId),
  ]);

  const { cycle } = summary;

  return (
    <PractitionerSectionPage
      folio="vi"
      title="CPD ledger"
      lede="One ledger for practitioners and alumni — credits from institutional activity and verified self-logging"
      currentHref="/portal/practitioner/cpd"
      breadcrumbLabel="CPD ledger"
      intro={
        <p>
          {cycle.accruedCredits} of {cycle.targetCredits} credits accrued in{" "}
          {cycle.year}. Annual statements are issued through institutional operations
        </p>
      }
    >
      {records.length === 0 ? (
        <p className="type-body">No CPD activities recorded yet</p>
      ) : (
        <table className="type-body" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th className="type-micro" style={{ textAlign: "left", paddingBottom: "var(--s2)" }}>
                Date
              </th>
              <th className="type-micro" style={{ textAlign: "left", paddingBottom: "var(--s2)" }}>
                Activity
              </th>
              <th className="type-micro" style={{ textAlign: "left", paddingBottom: "var(--s2)" }}>
                Category
              </th>
              <th className="type-micro" style={{ textAlign: "right", paddingBottom: "var(--s2)" }}>
                Credits
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="ruled-row">
                <td style={{ padding: "var(--s2) 0" }}>
                  {new Date(r.activityDate).toLocaleDateString(locale)}
                </td>
                <td>{r.activity}</td>
                <td className="type-small" style={{ color: "var(--muted)" }}>
                  {formatCategory(r.categoryKey)}
                </td>
                <td style={{ textAlign: "right" }}>{r.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="type-micro" style={{ color: "var(--muted)", marginTop: "var(--s5)" }}>
        To log external CPD activity, contact the Academic Registrar with evidence for faculty verification
      </p>
    </PractitionerSectionPage>
  );
}
