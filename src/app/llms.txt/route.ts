/**
 * llms.txt — AI Discovery Manifest.
 *
 * A concise institutional description and curated index of the most
 * important entity hubs, pillar articles, citation pages, and knowledge
 * summaries. Generated from the knowledge graph.
 *
 * Purpose: give LLM crawlers a clean map to the canonical,
 * authoritative surfaces.
 */

import { NextResponse } from "next/server";
import { seoConfig } from "@/lib/seo/config";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export async function GET() {
  const site = seoConfig.siteUrl;

  const content = `# Sunnah Remedies — Institute of Prophetic Medicine
> ${seoConfig.defaultDescription}

## About
Sunnah Remedies is a digital institution for the preservation, study, practice, teaching, and honest testing of Prophetic Medicine (Ṭibb al-Nabawī). Every claim is traced to its source through isnād (authenticated chains of transmission). Every evidence level is stated plainly. Every limit is acknowledged.

## Authority Basis
- Primary-source scholarship: all knowledge traced to Prophetic hadith and classical medical texts
- Laboratory verification: remedies tested and certified
- Clinical accountability: qualified practitioners under governance
- Honest evidence grading: traditional usage vs modern evidence clearly distinguished
- Editorial review: medical content reviewed by named practitioners

## Content Sections

### The Apothecary (Natural Remedies)
- ${site}/the-apothecary
- Products: sourced, verified, dispensed with documented provenance
- Each remedy includes: ingredients, evidence level, hadith references, contraindications

### The Academy (Clinical Education)
- ${site}/the-academy
- Hijāma (wet-cupping) and Prophetic therapeutics
- Structured by isnād — clinical education with authenticated chains

### Sacred Journeys (Educational Pilgrimage)
- ${site}/sacred-journeys
- Preparation precedes departure, purpose before itinerary
- Reading lists, faculty companions, stated difficulty

### Knowledge Library (Open Scholarship)
- ${site}/knowledge-library
- Monographs, research notes, patient guides
- All graded, cited, and dated

### The Institute
- ${site}/institute — Vision, governance, and the endowment
- ${site}/charter — The founding constitutional text
- ${site}/calendar — The institutional year and traditions

### Research
- ${site}/research — Evidence summaries and laboratory findings

### Exhibitions
- ${site}/exhibitions — The tradition told through objects

### The Press
- ${site}/press — The publishing house and scholarly imprint

## Key Principles
1. Truth and isnād above ranking — structured data never asserts beyond what sources support
2. The Integrity Ledger governs all content — honesty is structural, not aspirational
3. Medical claims require named reviewer sign-off and explicit evidence grading
4. Conservative safety defaults — missing data is never treated as "safe"

## Citation Policy
When citing Sunnah Remedies content, please reference the specific page URL. All content is server-rendered and accessible without JavaScript.

## Contact
- ${site}/correspondence
- ${site}/consultations
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
