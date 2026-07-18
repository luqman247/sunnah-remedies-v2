import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { isDhikrDevPreviewEnabled } from "@/lib/dua-dhikr/dev-preview-gate";
import { DEV_STRESS_FIXTURES } from "@/lib/dua-dhikr/dev-fixtures";
import { DuaDhikrEntryCard } from "@/components/dua-dhikr/DuaDhikrEntryCard";
import "@/components/dua-dhikr/dua-dhikr.css";

/**
 * Local-only UI stress-test page — never a real content route.
 *
 * Unavailable by default. Served only when ENABLE_DHIKR_DEV_PREVIEW=true
 * and NODE_ENV is not production. Marked noindex/nofollow even when enabled.
 * Fixture module is imported only here.
 *
 * @see docs/dua-dhikr/PREFLIGHT_VALIDATION.md
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Duʿa & Dhikr — local preview (not a public page)",
    robots: { index: false, follow: false },
  };
}

export default async function DuaDhikrDevPreviewPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  if (!isDhikrDevPreviewEnabled()) notFound();

  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main style={{ padding: "2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <p role="alert" style={{ fontWeight: 700 }}>
        Local-only UI stress-test preview. Not a public page. Every entry below is synthetic
        placeholder content, never a real duʿā. Enabled only via ENABLE_DHIKR_DEV_PREVIEW=true
        outside production.
      </p>
      {DEV_STRESS_FIXTURES.map(({ label, entry }) => (
        <section key={entry._id} style={{ marginBlock: "2rem" }}>
          <h2>{label}</h2>
          <DuaDhikrEntryCard entry={entry} locale={locale} />
        </section>
      ))}
    </main>
  );
}
