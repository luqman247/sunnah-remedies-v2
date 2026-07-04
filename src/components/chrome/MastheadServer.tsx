import { getLocale, getTranslations } from "next-intl/server";
import { getNavigation } from "@/sanity/lib/fetch";
import { Masthead } from "./Masthead";

const NAV_KEYS: { key: string; href: string; highlighted?: boolean }[] = [
  { key: "theApothecary", href: "/the-apothecary" },
  { key: "theAcademy", href: "/the-academy" },
  { key: "sacredJourneys", href: "/sacred-journeys" },
  { key: "knowledgeLibrary", href: "/knowledge-library" },
  { key: "consultations", href: "/consultations", highlighted: true },
];

export async function MastheadServer() {
  const locale = await getLocale();
  const [nav, t] = await Promise.all([
    getNavigation(locale),
    getTranslations("nav"),
  ]);

  const items = nav.items.length
    ? nav.items.map((item) => {
        const match = NAV_KEYS.find((n) => n.href === item.href);
        return match ? { ...item, label: t(match.key as never) } : item;
      })
    : NAV_KEYS.map((n) => ({
        label: t(n.key as never),
        href: n.href,
        highlighted: n.highlighted,
      }));

  return <Masthead navItems={items} />;
}
