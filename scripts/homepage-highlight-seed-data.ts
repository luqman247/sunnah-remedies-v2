/**
 * Explicit editorial seed data for homepage highlights.
 *
 * Used only by scripts/seed-homepage-highlights.ts.
 * Never import this module from runtime application code.
 */

export type SeedLocale = "en" | "da";

export const DUA_DHIKR_HIGHLIGHT_HREF = "/knowledge-library/dua-dhikr";

const COPY: Record<
  SeedLocale,
  {
    eyebrow: string;
    title: string;
    summary: string;
    ctaLabel: string;
    imageAlt: string;
    contentAreaLabel: string;
  }
> = {
  en: {
    eyebrow: "NEW IN THE KNOWLEDGE LIBRARY",
    title: "Duʿā & Dhikr",
    summary:
      "A carefully reviewed library of supplications and remembrances from the Sunnah, organised around the moments of daily life",
    ctaLabel: "Explore Duʿā & Dhikr",
    imageAlt:
      "A serene still life featuring a dark green book with gold corners, an ornate wooden book stand, dark wooden prayer beads, and a brass incense burner with rising smoke on a rustic linen-covered table",
    contentAreaLabel: "Knowledge Library",
  },
  da: {
    eyebrow: "NYT I VIDENSBIBLIOTEKET",
    title: "Duʿā & Dhikr",
    summary:
      "Et omhyggeligt gennemgået bibliotek af bønner og ihukommelser fra sunnah, ordnet omkring hverdagens øjeblikke",
    ctaLabel: "Udforsk Duʿā & Dhikr",
    imageAlt:
      "Et roligt stilleben med en mørkegrøn bog med guldhjørner, en udskåret bogstøtte i træ, mørke bedekranse i træ og en røgelsesbrænder i messing med opstigende røg på et rustikt, hørklædt bord",
    contentAreaLabel: "Vidensbiblioteket",
  },
};

export function getHomepageHighlightSeedPayload(locale: SeedLocale) {
  const copy = COPY[locale];
  return {
    id:
      locale === "en"
        ? "homepageHighlight-dua-dhikr"
        : "homepageHighlight-dua-dhikr-da",
    language: locale,
    internalName:
      locale === "en"
        ? "Duʿā & Dhikr — Knowledge Library"
        : "Duʿā & Dhikr — Vidensbiblioteket",
    enabled: true,
    eyebrow: copy.eyebrow,
    title: copy.title,
    summary: copy.summary,
    imageAlt: copy.imageAlt,
    contentArea: "knowledge-library",
    contentAreaLabel: copy.contentAreaLabel,
    destinationType: "pathname" as const,
    pathname: DUA_DHIKR_HIGHLIGHT_HREF,
    ctaLabel: copy.ctaLabel,
    publishedAt: "2026-07-18T12:00:00.000Z",
    pinned: true,
    priority: 100,
    showNewMarker: true,
    visualTheme: "dua-dhikr" as const,
  };
}
