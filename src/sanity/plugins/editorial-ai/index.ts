/**
 * Editorial AI Plugin for Sanity Studio (§7.7 / Milestone 11).
 *
 * Provides AI-powered editorial tools inside Sanity Studio:
 * - Generate summaries
 * - Suggest internal links
 * - Generate FAQs
 * - SEO / OpenGraph descriptions
 * - Suggest citations
 * - Flag unsupported claims
 * - Detect duplicates
 * - Readability review
 *
 * All outputs are SUGGESTIONS requiring human approval.
 */

import { definePlugin } from "sanity";

const EDITORIAL_AI_ACTIONS = [
  {
    id: "generate_summary",
    title: "Generate Summary",
    description: "Create a concise institutional summary",
    icon: "📝",
  },
  {
    id: "suggest_links",
    title: "Suggest Internal Links",
    description: "Find relevant internal linking opportunities",
    icon: "🔗",
  },
  {
    id: "generate_faqs",
    title: "Generate FAQs",
    description: "Create frequently asked questions from content",
    icon: "❓",
  },
  {
    id: "seo_description",
    title: "SEO Description",
    description: "Generate an optimised meta description",
    icon: "🔍",
  },
  {
    id: "og_description",
    title: "OpenGraph Description",
    description: "Generate a social sharing description",
    icon: "📱",
  },
  {
    id: "suggest_citations",
    title: "Suggest Citations",
    description: "Identify claims that need citations",
    icon: "📚",
  },
  {
    id: "flag_unsupported_claims",
    title: "Flag Unsupported Claims",
    description: "Check claims against the institutional corpus",
    icon: "⚠️",
  },
  {
    id: "detect_duplicates",
    title: "Detect Duplicates",
    description: "Check for similar existing content",
    icon: "🔄",
  },
  {
    id: "readability_review",
    title: "Readability Review",
    description: "Assess content clarity and readability",
    icon: "📖",
  },
] as const;

export type EditorialAiAction = (typeof EDITORIAL_AI_ACTIONS)[number]["id"];

export { EDITORIAL_AI_ACTIONS };

/**
 * Call the Editorial AI API from Sanity Studio.
 * Pass the current Studio user's Sanity token from useClient().config().token.
 * Never use a shared admin token in the browser.
 */
export async function callEditorialAi(
  action: EditorialAiAction,
  content: string,
  options: {
    sanityToken: string;
    title?: string;
    language?: string;
  },
): Promise<Record<string, unknown>> {
  if (!options.sanityToken) {
    throw new Error("Sign in to Sanity Studio to use Editorial AI");
  }

  const response = await fetch("/api/ai/editorial", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.sanityToken}`,
    },
    body: JSON.stringify({
      action,
      content,
      title: options.title,
      language: options.language,
    }),
  });

  if (!response.ok) {
    throw new Error(`Editorial AI error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Sanity plugin registration.
 */
export const editorialAiPlugin = definePlugin({
  name: "editorial-ai",
});
