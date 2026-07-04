/**
 * AI Translation Surface (§7.5 / Milestone 9).
 *
 * Governed translation between English, Arabic, and Danish.
 * Preserves medical terminology, Islamic terminology, Arabic
 * quotations verbatim, references, metadata, and internal links.
 */

import { getGenerationProvider } from "../../generation/provider";
import { assembleSystemPrompt } from "../../prompts";

/* ── Locked Terminology Glossary ─────────────────────────────────── */

const LOCKED_TERMS: Record<string, Record<string, string>> = {
  hijamah: { en: "Hijāmah (cupping)", ar: "الحجامة", da: "Hijāmah (kopping)" },
  "black seed": { en: "Black seed (Nigella sativa)", ar: "الحبة السوداء", da: "Sort frø (Nigella sativa)" },
  honey: { en: "Honey", ar: "العسل", da: "Honning" },
  senna: { en: "Senna (Senna makki)", ar: "السنا", da: "Senna (Senna makki)" },
  "olive oil": { en: "Olive oil", ar: "زيت الزيتون", da: "Olivenolie" },
  talbinah: { en: "Talbīnah", ar: "التلبينة", da: "Talbīnah" },
  sidr: { en: "Sidr (Lote tree)", ar: "السدر", da: "Sidr (Lotustræ)" },
  zamzam: { en: "Zamzam water", ar: "ماء زمزم", da: "Zamzam-vand" },
  ruqyah: { en: "Ruqyah", ar: "الرقية", da: "Ruqyah" },
  tibb: { en: "Prophetic Medicine (Ṭibb al-Nabawī)", ar: "الطب النبوي", da: "Profetisk medicin (Ṭibb al-Nabawī)" },
  sahih: { en: "Ṣaḥīḥ (authentic)", ar: "صحيح", da: "Ṣaḥīḥ (autentisk)" },
  hasan: { en: "Ḥasan (good)", ar: "حسن", da: "Ḥasan (god)" },
  daif: { en: "Ḍaʿīf (weak)", ar: "ضعيف", da: "Ḍaʿīf (svag)" },
};

/* ── Translation Interface ───────────────────────────────────────── */

export interface TranslationRequest {
  content: string;
  sourceLanguage: string;
  targetLanguage: string;
  contentType?: "article" | "product" | "course" | "general" | "seo";
  preserveLinks?: boolean;
  preserveMetadata?: boolean;
}

export interface TranslationResult {
  translated: string;
  sourceLanguage: string;
  targetLanguage: string;
  preservedTerms: string[];
  warnings: string[];
}

/* ── Core Translation ────────────────────────────────────────────── */

export async function translate(
  request: TranslationRequest
): Promise<TranslationResult> {
  const provider = getGenerationProvider();

  const glossaryEntries = Object.entries(LOCKED_TERMS)
    .map(
      ([key, translations]) =>
        `- ${key}: ${request.sourceLanguage}="${translations[request.sourceLanguage] || key}" → ${request.targetLanguage}="${translations[request.targetLanguage] || key}"`
    )
    .join("\n");

  const systemPrompt = assembleSystemPrompt("translation");

  const userMessage = `Translate the following content from ${getLanguageName(request.sourceLanguage)} to ${getLanguageName(request.targetLanguage)}.

LOCKED TERMINOLOGY GLOSSARY (use these exact translations):
${glossaryEntries}

PRESERVATION RULES:
1. Arabic Qur'anic text and Hadith text must be passed through VERBATIM — never re-translate or paraphrase
2. Medical terminology must use the exact locked term
3. Islamic terminology must preserve transliteration and Arabic
4. ${request.preserveLinks ? "Internal links (e.g. /the-apothecary/black-seed-oil) must remain unchanged" : ""}
5. ${request.preserveMetadata ? "Metadata structures (JSON, frontmatter) must preserve their structure" : ""}

CONTENT TO TRANSLATE:
${request.content}

Return ONLY the translated content. Do not add explanations or notes.`;

  const response = await provider.generate({
    systemPrompt,
    userMessage,
    temperature: 0.1,
  });

  const preservedTerms: string[] = [];
  for (const [key, translations] of Object.entries(LOCKED_TERMS)) {
    const targetTerm = translations[request.targetLanguage];
    if (targetTerm && response.content.includes(targetTerm)) {
      preservedTerms.push(key);
    }
  }

  return {
    translated: response.content,
    sourceLanguage: request.sourceLanguage,
    targetLanguage: request.targetLanguage,
    preservedTerms,
    warnings: [],
  };
}

/* ── Batch Translation ───────────────────────────────────────────── */

export async function translateBatch(
  items: TranslationRequest[]
): Promise<TranslationResult[]> {
  const results: TranslationResult[] = [];
  for (const item of items) {
    results.push(await translate(item));
  }
  return results;
}

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: "English",
    ar: "Arabic",
    da: "Danish",
    fr: "French",
    de: "German",
    tr: "Turkish",
    ur: "Urdu",
    ms: "Malay",
  };
  return names[code] || code;
}
