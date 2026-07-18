import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { getNavigation } from "@/sanity/lib/fetch";
import { NAV_HREF_MESSAGE_KEYS } from "@/lib/i18n/chrome-labels";
import { Masthead } from "./Masthead";

const NAV_FALLBACK = [
  { href: "/the-apothecary", highlighted: false },
  { href: "/the-academy", highlighted: false },
  { href: "/sacred-journeys", highlighted: false },
  { href: "/knowledge-library", highlighted: false },
  { href: "/consultations", highlighted: true },
] as const;

export async function MastheadServer({ locale }: { locale: AppLocale }) {
  const [nav, t] = await Promise.all([
    getNavigation(locale),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  const structure = nav.fromCms
    ? nav.items.map((item) => ({
        href: item.href,
        highlighted: item.highlighted,
      }))
    : NAV_FALLBACK.map((item) => ({
        href: item.href,
        highlighted: item.highlighted,
      }));

  const items = structure.map((item) => {
    const key = NAV_HREF_MESSAGE_KEYS[item.href];
    return {
      href: item.href,
      highlighted: item.highlighted,
      label: key ? t(key as never) : item.href,
    };
  });

  return <Masthead navItems={items} />;
}
