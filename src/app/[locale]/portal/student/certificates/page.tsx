import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { requireStudentPortal } from "@/lib/auth/portal-guard";
import { getCertificates } from "@/modules/practitioner/credentials";

export const metadata: Metadata = {
  title: "Certificates",
};

export default async function StudentCertificatesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requireStudentPortal("/portal/student/certificates");
  const certificates = await getCertificates(session.accountId);

  return (
    <StudentSectionPage
      folio="vii"
      title="Certificates"
      lede="Credentials issued on programme completion — verifiable and portable"
      currentHref="/portal/student/certificates"
      breadcrumbLabel="Certificates"
    >
      {certificates.length === 0 ? (
        <>
          <p className="type-body">No certificates issued yet</p>
          <p className="type-micro" style={{ color: "var(--muted)", marginTop: "var(--s3)" }}>
            On completion you receive a verifiable credential and automatic conferral
            of alumnus status — the beginning of your relationship with the institution
          </p>
        </>
      ) : (
        certificates.map((c) => (
          <article key={c.id} className="policy-block">
            <h2 className="type-title">{c.courseName}</h2>
            <p className="type-micro" style={{ color: "var(--muted)" }}>
              {c.certificateNumber} · {new Date(c.issuedAt).toLocaleDateString(locale)}
            </p>
          </article>
        ))
      )}
    </StudentSectionPage>
  );
}
