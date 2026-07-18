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
  { href: "/institute", highlighted: false },
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

  // Ensure Institute remains reachable even when CMS omits it.
  const hasInstitute = structure.some((item) => item.href === "/institute");
  const withInstitute = hasInstitute
    ? structure
    : [
        ...structure.filter((item) => !item.highlighted),
        { href: "/institute", highlighted: false },
        ...structure.filter((item) => item.highlighted),
      ];

  const items = withInstitute.map((item) => {
    const key = NAV_HREF_MESSAGE_KEYS[item.href];
    const isConsultation = item.href === "/consultations" && item.highlighted;
    return {
      href: item.href,
      highlighted: item.highlighted,
      // Global primary action uses a direct task label, not department wording.
      label: isConsultation
        ? t("bookConsultation")
        : key
          ? t(key as never)
          : item.href,
    };
  });

  return <Masthead navItems={items} />;
}
