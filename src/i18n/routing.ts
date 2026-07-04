import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "./locales";

const prefixes = Object.fromEntries(
  LOCALES.filter((l) => l.prefix).map((l) => [l.id, l.prefix]),
) as Record<string, `/${string}`>;

export const routing = defineRouting({
  locales: LOCALES.map((l) => l.id),
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: {
    mode: "as-needed",
    prefixes,
  },
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
  localeDetection: true,
});
