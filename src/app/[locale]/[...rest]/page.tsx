import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";

/**
 * Catch unmatched paths under `[locale]` so `not-found.tsx` renders
 * with localised chrome (next-intl recommended pattern).
 */
export default async function LocaleCatchAll({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
