import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";
import { getCertificates } from "@/modules/practitioner/credentials";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Course and event credentials held",
};

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requirePractitionerPortal("/portal/practitioner/certificates");
  const certificates = await getCertificates(session.accountId);

  return (
    <PractitionerSectionPage
      folio="vii"
      title="Certificates"
      lede="Credentials issued on programme completion and verified event attendance"
      currentHref="/portal/practitioner/certificates"
      breadcrumbLabel="Certificates"
    >
      {certificates.length === 0 ? (
        <p className="type-body">No certificates on record</p>
      ) : (
        certificates.map((c) => (
          <article key={c.id} className="policy-block">
            <h2 className="type-title">{c.courseName}</h2>
            <p className="type-micro" style={{ color: "var(--muted)" }}>
              Certificate {c.certificateNumber} · Issued{" "}
              {new Date(c.issuedAt).toLocaleDateString(locale)}
            </p>
          </article>
        ))
      )}
    </PractitionerSectionPage>
  );
}
