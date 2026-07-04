import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";
import {
  getDigitalCredentials,
  getCredentialVerificationCode,
} from "@/modules/practitioner/credentials";

export const metadata: Metadata = {
  title: "Digital credentials",
  description: "Verifiable badges and practitioner verification status",
};

export default async function CredentialsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requirePractitionerPortal("/portal/practitioner/credentials");
  const [credentials, verificationCode] = await Promise.all([
    getDigitalCredentials(session.accountId),
    getCredentialVerificationCode(session.accountId),
  ]);

  return (
    <PractitionerSectionPage
      folio="viii"
      title="Digital credentials"
      lede="Verifiable records — portable, tamper-evident, and professionally respected"
      currentHref="/portal/practitioner/credentials"
      breadcrumbLabel="Digital credentials"
    >
      <section className="policy-block">
        <h2 className="type-title">Practitioner verification</h2>
        <p className="type-body">
          {credentials.practitionerVerified
            ? "Your practitioner status is verified by the institution"
            : "Practitioner verification has not been granted or is pending review"}
        </p>
        {credentials.verifiedUntil && (
          <p className="type-micro" style={{ color: "var(--muted)" }}>
            Valid until {new Date(credentials.verifiedUntil).toLocaleDateString(locale)}
          </p>
        )}
        {verificationCode && (
          <p className="type-body" style={{ marginTop: "var(--s3)" }}>
            Verification code: <span className="type-micro">{verificationCode}</span>
          </p>
        )}
      </section>

      <section className="policy-block">
        <h2 className="type-title">Course certificates</h2>
        {credentials.certificates.length === 0 ? (
          <p className="type-body">No verifiable course credentials yet</p>
        ) : (
          credentials.certificates.map((c) => (
            <article key={c.id} style={{ marginBottom: "var(--s4)" }}>
              <p className="type-title">{c.courseName}</p>
              <p className="type-micro" style={{ color: "var(--muted)" }}>
                {c.certificateNumber}
              </p>
            </article>
          ))
        )}
      </section>
    </PractitionerSectionPage>
  );
}
