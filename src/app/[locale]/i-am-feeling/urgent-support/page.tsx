import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { buildStaticMetadata } from "@/lib/seo/metadata";
import { SectionPage } from "@/components/ui/SectionPage";
import { knowledgeLibrary } from "@/lib/navigation/site-structure";
import { isCrisisItemVerified, isUrgentSupportPagePublishable } from "@/lib/feeling/crisis-info";
import "@/components/feeling/feeling.css";
import "../i-am-feeling-landing.css";

/**
 * "I am feeling…" — urgent-support pathway (SPEC §8, §14).
 *
 * A quiet exit, never an ordinary feeling tile — reached only via the
 * persistent "See urgent support" link on the landing page, every feeling
 * detail page, the mandatory professional-support note on heightened
 * states, and the search crisis-keyword interception. Always noindex,
 * nofollow: this page exists for visitors already on the site, not as an
 * SEO acquisition page for people in acute crisis, who should land on a
 * dedicated national service directly rather than a duʿā site's subpage.
 *
 * No form fields anywhere. No A/B testing, no personalisation.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "feeling.urgentSupport" });
  const base = buildStaticMetadata("/i-am-feeling/urgent-support", t("heading"), t("intro"));
  return { ...base, robots: { index: false, follow: false } };
}

export default async function UrgentSupportPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Explicit { locale, namespace } — see i-am-feeling/page.tsx's comment on
  // the same pattern.
  const t = await getTranslations({ locale, namespace: "feeling.urgentSupport" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tFeeling = await getTranslations({ locale, namespace: "feeling" });

  const publishable = isUrgentSupportPagePublishable();
  const samaritansVerified = isCrisisItemVerified("samaritans");
  const shoutVerified = isCrisisItemVerified("shout");
  const hasAnyDirectLine = samaritansVerified || shoutVerified;

  return (
    <SectionPage
      department={knowledgeLibrary}
      folio="xvii"
      currentHref="/i-am-feeling"
      breadcrumb={[
        { label: tNav("knowledgeLibrary"), href: "/knowledge-library" },
        { label: tFeeling("breadcrumb"), href: "/i-am-feeling" },
        { label: t("breadcrumbLabel") },
      ]}
      intro={
        <div className="feeling-hero">
          <h1 className="feeling-hero__heading">{t("heading")}</h1>
          <p className="feeling-hero__lede">{t("intro")}</p>
        </div>
      }
    >
      <section className="policy-block feeling-landing__section">
        <p className="feeling-landing__note">{t("cannotHelpNotice")}</p>
      </section>

      {/* Always renders regardless of the verification gate below — 999 and
          the NHS 111 mental-health option are the UK's standing emergency
          guidance, not a charity-specific number subject to routine change
          (SPEC §14). */}
      <section aria-labelledby="urgent-support-emergency-heading" className="policy-block feeling-landing__section">
        <h2 id="urgent-support-emergency-heading" className="section-label">
          {t("emergencyHeading")}
        </h2>
        <p className="feeling-landing__explanation">{t("emergencyBody")}</p>
      </section>

      {publishable && hasAnyDirectLine ? (
        <section aria-labelledby="urgent-support-crisis-lines-heading" className="policy-block feeling-landing__section">
          <h2 id="urgent-support-crisis-lines-heading" className="section-label">
            {t("crisisLinesHeading")}
          </h2>
          {samaritansVerified && (
            <p className="feeling-landing__explanation">
              <strong>{t("samaritansLabel")}</strong> — {t("samaritansBody")}
            </p>
          )}
          {shoutVerified && (
            <p className="feeling-landing__explanation">
              <strong>{t("shoutLabel")}</strong> — {t("shoutBody")}
            </p>
          )}
        </section>
      ) : (
        <section aria-labelledby="urgent-support-crisis-lines-heading" className="policy-block feeling-landing__section">
          <h2 id="urgent-support-crisis-lines-heading" className="section-label">
            {t("crisisLinesHeading")}
          </h2>
          <p className="feeling-landing__explanation">{t("crisisLinesUnavailableNotice")}</p>
        </section>
      )}

      <section aria-labelledby="urgent-support-trusted-heading" className="policy-block feeling-landing__section">
        <h2 id="urgent-support-trusted-heading" className="section-label">
          {t("trustedPersonHeading")}
        </h2>
        <p className="feeling-landing__explanation">{t("trustedPersonBody")}</p>
      </section>

      <section className="policy-block feeling-landing__section">
        <p className="feeling-landing__note">{t("nonReplacementNotice")}</p>
      </section>

      <section aria-labelledby="urgent-support-outside-uk-heading" className="policy-block feeling-landing__section">
        <h2 id="urgent-support-outside-uk-heading" className="section-label">
          {t("outsideUkHeading")}
        </h2>
        <p className="feeling-landing__explanation">{t("outsideUkBody")}</p>
      </section>
    </SectionPage>
  );
}
