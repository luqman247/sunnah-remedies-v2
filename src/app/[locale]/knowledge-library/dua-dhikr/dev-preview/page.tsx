import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { DEV_STRESS_FIXTURES } from "@/lib/dua-dhikr/dev-fixtures";
import { DuaDhikrEntryCard } from "@/components/dua-dhikr/DuaDhikrEntryCard";
import "@/components/dua-dhikr/dua-dhikr.css";

/**
 * Development-only UI stress-test page — never a real content route.
 *
 * Refuses to render outside `next dev` (see the NODE_ENV guard below), is
 * marked `noindex, nofollow`, and renders only the synthetic fixtures in
 * src/lib/dua-dhikr/dev-fixtures.ts — never Sanity data, never real duʿā
 * content. `npm run build` + `next start` (production mode) 404s this
 * route; only `next dev` serves it, for this project's own visual QA.
 *
 * @see docs/dua-dhikr/PREFLIGHT_VALIDATION.md
 */

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Duʿa & Dhikr — dev preview (not a real page)", robots: { index: false, follow: false } };
}

export default async function DuaDhikrDevPreviewPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main style={{ padding: "2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <p role="alert" style={{ fontWeight: 700 }}>
        Development-only UI stress-test preview. Not a real page — 404s outside `next dev`. Every entry below is
        synthetic placeholder content, never a real duʿā.
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
