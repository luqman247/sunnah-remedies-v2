export type AppLocale = "en" | "da";

export interface LocaleConfig {
  id: AppLocale;
  /** User-facing URL prefix ('' means unprefixed root) */
  prefix: string;
  /** Native label shown in the switcher */
  label: string;
  /** Short code shown in compact switcher */
  short: string;
  /** Text direction — RTL-ready for future Arabic/Urdu/Pashto */
  dir: "ltr" | "rtl";
  /** BCP-47 tag for <html lang> and hreflang */
  htmlLang: string;
  /** Sanity language id (must match documentInternationalization config) */
  sanityId: string;
  /** Shopify LanguageCode enum value for @inContext */
  shopify: string;
  /** ISO for date/number formatting */
  intl: string;
}

export const LOCALES: LocaleConfig[] = [
  {
    id: "en",
    prefix: "",
    label: "English",
    short: "EN",
    dir: "ltr",
    htmlLang: "en",
    sanityId: "en",
    shopify: "EN",
    intl: "en-GB",
  },
  {
    id: "da",
    prefix: "/dk",
    label: "Dansk",
    short: "DA",
    dir: "ltr",
    htmlLang: "da",
    sanityId: "da",
    shopify: "DA",
    intl: "da-DK",
  },
];

export const DEFAULT_LOCALE: AppLocale = "en";

export const localeById = (id: string) =>
  LOCALES.find((l) => l.id === id) ?? LOCALES[0];

export const LOCALE_IDS = LOCALES.map((l) => l.id);
