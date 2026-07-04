/**
 * AI Visibility connector — Generative Engine Optimisation (GEO).
 *
 * Tracks whether Sunnah Remedies is cited by AI answer engines.
 * Classifies referral traffic from AI sources and monitors citation
 * presence across major AI platforms.
 *
 * This is directional intelligence — the discipline is nascent and
 * estimates carry uncertainty.
 */

const AI_REFERRER_DOMAINS = [
  "chat.openai.com",
  "chatgpt.com",
  "perplexity.ai",
  "claude.ai",
  "bard.google.com",
  "gemini.google.com",
  "copilot.microsoft.com",
  "you.com",
  "phind.com",
];

interface AIReferralData {
  source: string;
  visits: number;
  landingPages: string[];
}

interface AICitationCheck {
  query: string;
  platform: string;
  cited: boolean;
  position?: number;
  checkedAt: string;
}

/**
 * Classify whether a referrer is an AI engine.
 */
export function isAIReferrer(referrer: string): boolean {
  if (!referrer) return false;
  try {
    const url = new URL(referrer);
    return AI_REFERRER_DOMAINS.some(
      (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Extract the AI platform name from a referrer URL.
 */
export function getAIPlatform(referrer: string): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    const match = AI_REFERRER_DOMAINS.find(
      (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
    if (!match) return null;

    if (match.includes("openai") || match.includes("chatgpt")) return "ChatGPT";
    if (match.includes("perplexity")) return "Perplexity";
    if (match.includes("claude")) return "Claude";
    if (match.includes("gemini") || match.includes("bard")) return "Google AI";
    if (match.includes("copilot")) return "Copilot";
    if (match.includes("you.com")) return "You.com";
    if (match.includes("phind")) return "Phind";
    return match;
  } catch {
    return null;
  }
}

/**
 * Schema/entity readiness score — the on-site lever for AI citability.
 * Returns the percentage of entities with complete structured data.
 */
export function calculateEntityReadiness(
  totalEntities: number,
  entitiesWithSchema: number,
  entitiesWithCitations: number
): { schemaReadiness: number; citationReadiness: number; overall: number } {
  const schemaReadiness = totalEntities > 0
    ? Math.round((entitiesWithSchema / totalEntities) * 100)
    : 0;
  const citationReadiness = totalEntities > 0
    ? Math.round((entitiesWithCitations / totalEntities) * 100)
    : 0;

  return {
    schemaReadiness,
    citationReadiness,
    overall: Math.round((schemaReadiness + citationReadiness) / 2),
  };
}
