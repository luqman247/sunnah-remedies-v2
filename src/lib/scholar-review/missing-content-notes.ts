/**
 * Documented search findings for feeling states with no currently paired
 * Duʿā & Dhikr content. Summarised from docs/i-am-feeling/CONTENT_GAP_REGISTER.md
 * — kept in sync with that file; update both together if the search or
 * reasoning changes.
 */

export interface MissingContentNote {
  searchPerformed: string;
  rejectedCandidateReasoning: string;
  suggestedThemes: string;
}

export const MISSING_CONTENT_NOTES: Record<string, MissingContentNote> = {
  "feeling-alone": {
    searchPerformed:
      "Two rounds against the 425-entry staging library: round 1 matched titleEn for \"alone\"/\"lonely\"/\"isolated\"; round 2 widened to whatItIsFor, occasion, searchAliases, explanationText, and virtueText, adding \"companionship.\" \"Lonely\" and \"isolated\" returned zero hits in both rounds; \"alone\" and \"companionship\" matched only generic salah-context boilerplate with no thematic connection to loneliness.",
    rejectedCandidateReasoning: "No entry exists that addresses loneliness or the absence of companionship, directly or adjacently, under a reasonable search — there is nothing to reject because no candidate was found.",
    suggestedThemes:
      "Companionship with Allah in the absence of human company (e.g. Qurʾān 2:186, \"indeed I am near\"); the Prophet ﷺ's duʿā at Ṭāʾif during isolation; dhikr emphasising Allah's nearness (qurb) rather than a generic protection or gratitude duʿā repurposed.",
  },
  "struggling-with-envy": {
    searchPerformed:
      "A wider field search for \"envy,\" \"envious,\" and \"jealous\" surfaced duaDhikrEntry-lwa-080, the Muʿawwidhat (Sūrahs al-Falaq and an-Nās).",
    rejectedCandidateReasoning:
      "Sūrat al-Falaq's closing verse seeks refuge \"from the evil of an envier when he envies\" (Qurʾān 113:5) — protection FROM another person's envy directed at you, an external-threat framing. \"Struggling with Envy\" is architected as a person's own envy of someone else, an internal-disposition framing. Do NOT force-fit the Muʿawwidhat as a treatment for a person's own envy — these are related by root word only, not by request.",
    suggestedThemes:
      "Content addressing the internal disposition of envy: istighfār, gratitude practice, and the hadith \"Beware of envy, for envy devours good deeds as fire devours wood\" (Abū Dāwūd) — likely a prophetic-hadith pathway rather than a Qurʾānic-verse one. None of these specific texts were confirmed present in the current entry set under this search.",
  },
};
