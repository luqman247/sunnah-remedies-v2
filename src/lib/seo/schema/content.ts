/**
 * FAQPage + HowTo + VideoObject + Event JSON-LD builders.
 */

import { seoConfig } from "../config";
import { type JsonLdNode, orgRef } from "./index";

/* ── FAQPage ────────────────────────────────────────────────────── */

export interface FaqPair {
  question: string;
  answer: string;
}

export function faqPageSchema(faqs: FaqPair[], pageUrl: string): JsonLdNode {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/* ── HowTo ──────────────────────────────────────────────────────── */

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToSchemaInput {
  name: string;
  description: string;
  pageUrl: string;
  totalTime?: string;
  supply?: string[];
  tool?: string[];
  steps: HowToStep[];
}

export function howToSchema(input: HowToSchemaInput): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "HowTo",
    "@id": `${input.pageUrl}#howto`,
    name: input.name,
    description: input.description,
    step: input.steps.map((step, i) => {
      const s: JsonLdNode = {
        "@type": "HowToStep",
        position: i + 1,
        name: step.name,
        text: step.text,
      };
      if (step.image) s.image = step.image;
      return s;
    }),
  };

  if (input.totalTime) node.totalTime = input.totalTime;
  if (input.supply) {
    node.supply = input.supply.map((s) => ({ "@type": "HowToSupply", name: s }));
  }
  if (input.tool) {
    node.tool = input.tool.map((t) => ({ "@type": "HowToTool", name: t }));
  }

  return node;
}

/* ── VideoObject ────────────────────────────────────────────────── */

export interface VideoSchemaInput {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
  transcript?: string;
  pageUrl: string;
}

export function videoSchema(input: VideoSchemaInput): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "VideoObject",
    "@id": `${input.pageUrl}#video`,
    name: input.name,
    description: input.description,
    thumbnailUrl: input.thumbnailUrl,
    uploadDate: input.uploadDate,
    publisher: orgRef(),
  };

  if (input.duration) node.duration = input.duration;
  if (input.contentUrl) node.contentUrl = input.contentUrl;
  if (input.embedUrl) node.embedUrl = input.embedUrl;
  if (input.transcript) node.transcript = input.transcript;

  return node;
}

/* ── Event ──────────────────────────────────────────────────────── */

export interface EventSchemaInput {
  name: string;
  slug: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventAttendanceMode?: "Offline" | "Online" | "Mixed";
  image?: string;
}

export function eventSchema(input: EventSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/sacred-journeys/${input.slug}`;

  const modeMap: Record<string, string> = {
    Offline: "https://schema.org/OfflineEventAttendanceMode",
    Online: "https://schema.org/OnlineEventAttendanceMode",
    Mixed: "https://schema.org/MixedEventAttendanceMode",
  };

  const node: JsonLdNode = {
    "@type": "Event",
    "@id": `${url}#event`,
    name: input.name,
    description: input.description,
    url,
    startDate: input.startDate,
    organizer: orgRef(),
  };

  if (input.endDate) node.endDate = input.endDate;
  if (input.location) {
    node.location = { "@type": "Place", name: input.location };
  }
  if (input.eventAttendanceMode) {
    node.eventAttendanceMode = modeMap[input.eventAttendanceMode];
  }
  if (input.image) node.image = input.image;

  return node;
}
