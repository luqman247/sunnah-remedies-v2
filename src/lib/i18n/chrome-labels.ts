/**
 * Shared href → next-intl `nav.*` key map for chrome localisation.
 * CMS may supply order/href; visitor-facing labels always come from messages.
 */
export const NAV_HREF_MESSAGE_KEYS: Record<string, string> = {
  "/the-apothecary": "theApothecary",
  "/the-academy": "theAcademy",
  "/sacred-journeys": "sacredJourneys",
  "/knowledge-library": "knowledgeLibrary",
  "/institute": "theInstitute",
  "/consultations": "consultations",
  "/charter": "charter",
  "/correspondence": "correspondence",
  "/": "home",
};

export const DEPARTMENT_ID_NAV_KEYS: Record<string, string> = {
  apothecary: "theApothecary",
  academy: "theAcademy",
  "sacred-journeys": "sacredJourneys",
  "knowledge-library": "knowledgeLibrary",
  institution: "home",
};

/** Public URL prefixes that must never become breadcrumb labels (e.g. "Dk"). */
export const LOCALE_PATH_SEGMENTS = new Set(["dk", "da", "en"]);

export function stripLocalePrefixFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && LOCALE_PATH_SEGMENTS.has(parts[0].toLowerCase())) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function isPlaceholderEstablishmentCopy(value: string | undefined | null): boolean {
  if (!value) return true;
  return /———|–––|\u2014{2,}|\.{3}/.test(value);
}
