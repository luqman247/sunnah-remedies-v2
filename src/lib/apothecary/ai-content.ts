/**
 * AI product content generation — provider-abstracted, review-required drafts only.
 *
 * Never invents medical claims, certifications, hadith, or provenance.
 * Never publishes automatically — writes only to aiDraft with review-required status.
 */

import { getGenerationProvider } from "@/ai/generation/provider";

export type ProductContentAction =
  | "generate_description"
  | "make_shorter"
  | "make_detailed"
  | "make_clinical"
  | "make_editorial"
  | "translate_da"
  | "improve_seo"
  | "generate_faqs"
  | "generate_alt_text";

export interface ProductContentInput {
  name: string;
  category?: string;
  ingredients?: string[];
  origin?: string;
  formatOrSize?: string;
  intendedUse?: string;
  tone?: string;
  language?: "en" | "da";
  existingShortDescription?: string;
  existingFullDescription?: string;
  action: ProductContentAction;
}

export interface ProductContentDraft {
  shortDescription?: string;
  fullDescription?: string;
  keyQualities?: string[];
  productStory?: string;
  sourcingParagraph?: string;
  howToUse?: string;
  storageGuidance?: string;
  faqs?: { question: string; answer: string }[];
  seoTitle?: string;
  metaDescription?: string;
  altTextSuggestions?: string[];
  reviewStatus: "review-required";
  generatedAt: string;
  provider: string;
  warnings: string[];
}

const SYSTEM = `You are an editorial assistant for Sunnah Remedies, an institute of Prophetic Medicine.

Voice: institutional, calm, scholarly, clinical honesty. No marketing urgency. No trailing full stops on short labels.

HARD PROHIBITIONS — never invent or assert:
- medical cures, disease treatment, guaranteed results, or "clinically proven" claims
- certifications, laboratory results, ingredient quantities, or country of origin not supplied in the input
- Qur'anic verses, hadith text, or scholarly attributions not supplied in the input
- endorsements or unsupported health claims

If evidence is missing, write cautiously and state limits. Prefer "traditionally used" over medical claims.
Return valid JSON only.`;

function buildUserMessage(input: ProductContentInput): string {
  const facts = [
    `Product name: ${input.name}`,
    input.category ? `Category: ${input.category}` : null,
    input.ingredients?.length ? `Ingredients: ${input.ingredients.join(", ")}` : null,
    input.origin ? `Origin (only if supplied): ${input.origin}` : null,
    input.formatOrSize ? `Format/size: ${input.formatOrSize}` : null,
    input.intendedUse ? `Intended use (editorial): ${input.intendedUse}` : null,
    input.tone ? `Tone preference: ${input.tone}` : null,
    input.language ? `Language: ${input.language}` : "Language: en",
    input.existingShortDescription
      ? `Existing short description: ${input.existingShortDescription}`
      : null,
    input.existingFullDescription
      ? `Existing full description: ${input.existingFullDescription.slice(0, 2000)}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const actionInstructions: Record<ProductContentAction, string> = {
    generate_description:
      "Generate shortDescription (1-2 sentences), fullDescription (2-4 short paragraphs as a single string with newlines), keyQualities (3-5 strings), productStory, sourcingParagraph, howToUse, storageGuidance (brief factual storage note only from supplied facts), faqs (2-3), seoTitle, metaDescription, altTextSuggestions (2-3).",
    make_shorter: "Rewrite existing copy shorter while preserving facts. Return shortDescription and fullDescription.",
    make_detailed: "Expand existing copy with more editorial detail without inventing evidence. Return shortDescription and fullDescription.",
    make_clinical: "Rewrite in a more clinical, precise institutional voice. Return shortDescription and fullDescription.",
    make_editorial: "Rewrite in a more editorial, monograph voice. Return shortDescription and fullDescription.",
    translate_da: "Translate existing English copy to Danish (Dansk). Return shortDescription and fullDescription in Danish.",
    improve_seo: "Propose seoTitle (<=60 chars) and metaDescription (120-155 chars). Factual, institutional.",
    generate_faqs: "Propose 3-5 faqs as {question, answer} grounded only in supplied facts.",
    generate_alt_text: "Propose 3 altTextSuggestions for product photography. Descriptive, no marketing.",
  };

  return `${facts}

Action: ${input.action}
${actionInstructions[input.action]}

Return JSON with any of: shortDescription, fullDescription, keyQualities, productStory, sourcingParagraph, howToUse, storageGuidance, faqs, seoTitle, metaDescription, altTextSuggestions, warnings (array of strings noting limits or missing facts).`;
}

export async function generateProductContent(
  input: ProductContentInput,
): Promise<ProductContentDraft> {
  if (!input.name?.trim()) {
    throw new Error("Product name is required");
  }

  const provider = getGenerationProvider();
  const response = await provider.generate({
    systemPrompt: SYSTEM,
    userMessage: buildUserMessage(input),
    maxTokens: 2000,
    temperature: 0.3,
    responseFormat: "json",
  });

  let parsed: Record<string, unknown> = {};
  try {
    const raw = response.content.trim();
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    parsed = JSON.parse(
      jsonStart >= 0 ? raw.slice(jsonStart, jsonEnd + 1) : raw,
    ) as Record<string, unknown>;
  } catch {
    parsed = {
      shortDescription: response.content.slice(0, 280),
      warnings: ["Model returned non-JSON; stored truncated text as short description"],
    };
  }

  return {
    shortDescription:
      typeof parsed.shortDescription === "string" ? parsed.shortDescription : undefined,
    fullDescription:
      typeof parsed.fullDescription === "string" ? parsed.fullDescription : undefined,
    keyQualities: Array.isArray(parsed.keyQualities)
      ? (parsed.keyQualities as unknown[]).filter((x): x is string => typeof x === "string")
      : undefined,
    productStory: typeof parsed.productStory === "string" ? parsed.productStory : undefined,
    sourcingParagraph:
      typeof parsed.sourcingParagraph === "string" ? parsed.sourcingParagraph : undefined,
    howToUse: typeof parsed.howToUse === "string" ? parsed.howToUse : undefined,
    storageGuidance:
      typeof parsed.storageGuidance === "string" ? parsed.storageGuidance : undefined,
    faqs: Array.isArray(parsed.faqs)
      ? (parsed.faqs as { question?: string; answer?: string }[])
          .filter((f) => f.question && f.answer)
          .map((f) => ({ question: f.question!, answer: f.answer! }))
      : undefined,
    seoTitle: typeof parsed.seoTitle === "string" ? parsed.seoTitle : undefined,
    metaDescription:
      typeof parsed.metaDescription === "string" ? parsed.metaDescription : undefined,
    altTextSuggestions: Array.isArray(parsed.altTextSuggestions)
      ? (parsed.altTextSuggestions as unknown[]).filter((x): x is string => typeof x === "string")
      : undefined,
    reviewStatus: "review-required",
    generatedAt: new Date().toISOString(),
    provider: process.env.ANTHROPIC_TRANSLATION_MODEL || "anthropic",
    warnings: Array.isArray(parsed.warnings)
      ? (parsed.warnings as unknown[]).filter((x): x is string => typeof x === "string")
      : [
          "AI generated — human review required before publishing",
          "Do not treat this draft as verified scholarship or clinical advice",
        ],
  };
}
