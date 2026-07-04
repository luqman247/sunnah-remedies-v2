/**
 * Source Adapters — Typed Ingestion from Systems of Record (§2).
 *
 * Each adapter normalises content into DocumentChunks with complete
 * Provenance Envelopes before indexing. No content enters the
 * retrievable corpus without a complete envelope.
 */

import { client } from "@/sanity/lib/client";
import type { DocumentChunk } from "../../evidence-engine/types";
import {
  chunkQuranAyah,
  chunkHadith,
  chunkArticle,
  chunkProduct,
  chunkFaq,
  chunkResearchPaper,
  chunkCourseLecture,
} from "../chunking";
import type {
  HadithRecord,
} from "../chunking";

/* ── Portable Text → Plain Text ──────────────────────────────────── */

function portableTextToPlain(blocks: unknown[]): string {
  if (!Array.isArray(blocks)) return "";
  return (blocks as Record<string, unknown>[])
    .filter((b) => b._type === "block")
    .map((b) => {
      const children = b.children as { text?: string }[] | undefined;
      return children?.map((c) => c.text || "").join("") || "";
    })
    .join("\n\n");
}

function extractSections(
  blocks: unknown[]
): { heading: string; text: string; headingPath: string[] }[] {
  if (!Array.isArray(blocks)) return [];
  const sections: { heading: string; text: string; headingPath: string[] }[] = [];
  let currentHeading = "Introduction";
  let currentText: string[] = [];
  const headingStack: string[] = [];

  for (const block of blocks as Record<string, unknown>[]) {
    if (block._type === "block") {
      const style = block.style as string;
      const text =
        (block.children as { text?: string }[])
          ?.map((c) => c.text || "")
          .join("") || "";

      if (style && style.startsWith("h")) {
        if (currentText.length > 0) {
          sections.push({
            heading: currentHeading,
            text: currentText.join("\n\n"),
            headingPath: [...headingStack, currentHeading],
          });
          currentText = [];
        }
        currentHeading = text;
        const level = parseInt(style.replace("h", ""));
        while (headingStack.length >= level) headingStack.pop();
        headingStack.push(text);
      } else if (text.trim()) {
        currentText.push(text);
      }
    }
  }

  if (currentText.length > 0) {
    sections.push({
      heading: currentHeading,
      text: currentText.join("\n\n"),
      headingPath: [...headingStack, currentHeading],
    });
  }

  return sections;
}

/* ── Hadith Adapter ──────────────────────────────────────────────── */

export async function ingestHadith(docId: string): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "hadith" && _id == $id][0]`,
    { id: docId }
  );
  if (!doc) return [];

  const record: HadithRecord = {
    arabicText: doc.arabicText,
    translation: doc.translation,
    collection: doc.collection || "Unknown",
    number: doc.number || "0",
    narrator: doc.narrator,
    grade: doc.authenticity || "sahih",
    book: doc.book,
    topic: doc.topic,
    commentary: doc.commentary ? portableTextToPlain(doc.commentary) : undefined,
  };

  return [chunkHadith(record, docId, doc._rev || "", true)];
}

/* ── Qur'an Adapter ──────────────────────────────────────────────── */

export async function ingestQuranReference(
  docId: string
): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "quranReferenceDoc" && _id == $id][0]`,
    { id: docId }
  );
  if (!doc) return [];

  const chunks: DocumentChunk[] = [];
  const surahContext = doc.tafsir ? portableTextToPlain(doc.tafsir) : undefined;

  const startAyah = doc.ayahStart || 1;
  const endAyah = doc.ayahEnd || startAyah;

  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    chunks.push(
      chunkQuranAyah(
        {
          surah: doc.surah || doc.title,
          surahNumber: doc.surahNumber || 0,
          ayahNumber: ayah,
          arabicText: doc.arabicText || "",
          translation: doc.translation,
          surahContext,
        },
        docId,
        doc._rev || "",
        true
      )
    );
  }

  return chunks;
}

/* ── Article Adapter ─────────────────────────────────────────────── */

export async function ingestArticle(
  docId: string
): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "article" && _id == $id][0]{
      ...,
      "authorName": author->name,
      body
    }`,
    { id: docId }
  );
  if (!doc) return [];

  const sections = extractSections(doc.body || []);
  const fullText = portableTextToPlain(doc.body || []);

  return chunkArticle(
    {
      title: doc.title || "",
      author: doc.authorName,
      slug: doc.slug?.current || "",
      publishedAt: doc.publishedAt,
      sections,
      fullText,
    },
    docId,
    doc._rev || "",
    true
  );
}

/* ── Product Adapter ─────────────────────────────────────────────── */

export async function ingestProduct(
  docId: string
): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "product" && _id == $id][0]{
      ...,
      "ingredientNames": ingredients[]->name
    }`,
    { id: docId }
  );
  if (!doc) return [];

  const chunk = chunkProduct(
    {
      id: doc._id,
      title: doc.name || "",
      handle: doc.shopifyHandle,
      description: doc.institutionalSummary || doc.description,
      ingredients: doc.ingredientNames,
      benefits: doc.benefits,
      usage: doc.suggestedUse,
      warnings: doc.warnings,
      contraindications: doc.contraindications,
      preparation: doc.preparation,
      evidence: doc.evidenceEstablished,
    },
    docId,
    doc._rev || "",
    true
  );

  return [chunk];
}

/* ── Research Paper Adapter ──────────────────────────────────────── */

export async function ingestResearchPaper(
  docId: string
): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "researchPaper" && _id == $id][0]`,
    { id: docId }
  );
  if (!doc) return [];

  const summaryText = doc.summary ? portableTextToPlain(doc.summary) : "";
  const sections = summaryText
    ? [{ heading: "Summary", text: summaryText, headingPath: ["Summary"] }]
    : [];

  return chunkResearchPaper(
    {
      title: doc.title || "",
      authors: doc.authors || [],
      journal: doc.journal,
      year: doc.publicationDate?.split("-")[0],
      doi: doc.doi,
      abstract: doc.abstract,
      sections,
    },
    docId,
    doc._rev || "",
    true
  );
}

/* ── Programme / Course Adapter ──────────────────────────────────── */

export async function ingestProgramme(
  docId: string
): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "programme" && _id == $id][0]`,
    { id: docId }
  );
  if (!doc) return [];

  const parts: string[] = [`Programme: ${doc.name || ""}`];
  if (doc.subtitle) parts.push(doc.subtitle);
  if (doc.whatItIs) parts.push(`What it is: ${doc.whatItIs}`);
  if (doc.forWhom) parts.push(`For whom: ${doc.forWhom}`);
  if (doc.whatItAsks) parts.push(`What it asks: ${doc.whatItAsks}`);
  if (doc.learningOutcomes?.length) {
    parts.push(`Learning outcomes: ${doc.learningOutcomes.join("; ")}`);
  }
  if (doc.curriculum?.length) {
    for (const unit of doc.curriculum) {
      if (unit.title) parts.push(`${unit.title}: ${unit.description || ""}`);
    }
  }

  const content = parts.join("\n\n");

  return [
    {
      id: `prog-${docId}`,
      content,
      envelope: {
        chunkId: `prog-${docId}`,
        sourceCategory: "INSTITUTIONAL" as const,
        epistemicAxis: ["doctrinal", "evidentiary"] as const,
        citation: {
          type: "course" as const,
          courseId: docId,
        },
        language: "en",
        contentType: "course",
        accessLevel: "public" as const,
        sanityDocId: docId,
        sanityRev: doc._rev || "",
        editorialApproved: true,
        supersedes: null,
        lastVerifiedAt: new Date().toISOString(),
      },
      tokenCount: Math.ceil(content.length / 4),
    },
  ];
}

/* ── FAQ Adapter ─────────────────────────────────────────────────── */

export async function ingestFaqs(): Promise<DocumentChunk[]> {
  const docs = await client.fetch(
    `*[_type == "faq" && !(_id in path("drafts.**"))]{
      _id, _rev, question, answer, department
    }`
  );
  if (!docs?.length) return [];

  return docs.map(
    (doc: { _id: string; _rev: string; question: string; answer: string; department?: string }) =>
      chunkFaq(
        { question: doc.question, answer: doc.answer, department: doc.department },
        doc._id,
        doc._rev,
        true
      )
  );
}

/* ── Ingredient Adapter ──────────────────────────────────────────── */

export async function ingestIngredient(
  docId: string
): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "ingredient" && _id == $id][0]`,
    { id: docId }
  );
  if (!doc) return [];

  const parts: string[] = [`Ingredient: ${doc.name || ""}`];
  if (doc.botanicalName) parts.push(`Botanical name: ${doc.botanicalName}`);
  if (doc.arabicName) parts.push(`Arabic name: ${doc.arabicName}`);
  if (doc.description) parts.push(doc.description);
  if (doc.traditionalUses) parts.push(`Traditional uses: ${doc.traditionalUses}`);
  if (doc.modernResearch) parts.push(`Modern research: ${doc.modernResearch}`);

  const content = parts.join("\n");

  return [
    {
      id: `ing-${docId}`,
      content,
      envelope: {
        chunkId: `ing-${docId}`,
        sourceCategory: "INSTITUTIONAL" as const,
        epistemicAxis: ["doctrinal", "evidentiary"] as const,
        citation: {
          type: "product" as const,
          productId: docId,
          title: doc.name || "",
        },
        language: "en",
        contentType: "ingredient",
        accessLevel: "public" as const,
        sanityDocId: docId,
        sanityRev: doc._rev || "",
        editorialApproved: true,
        supersedes: null,
        lastVerifiedAt: new Date().toISOString(),
      },
      tokenCount: Math.ceil(content.length / 4),
    },
  ];
}

/* ── Condition Adapter ───────────────────────────────────────────── */

export async function ingestCondition(
  docId: string
): Promise<DocumentChunk[]> {
  const doc = await client.fetch(
    `*[_type == "condition" && _id == $id][0]`,
    { id: docId }
  );
  if (!doc) return [];

  const parts: string[] = [`Condition: ${doc.name || ""}`];
  if (doc.nameAr) parts.push(`Arabic: ${doc.nameAr}`);
  if (doc.definition) parts.push(doc.definition);
  if (doc.description) parts.push(doc.description);
  if (doc.symptoms?.length) parts.push(`Symptoms: ${doc.symptoms.join(", ")}`);
  if (doc.body) parts.push(portableTextToPlain(doc.body));
  if (doc.featuredSnippetAnswer) parts.push(doc.featuredSnippetAnswer);

  const content = parts.join("\n\n");

  return [
    {
      id: `cond-${docId}`,
      content,
      envelope: {
        chunkId: `cond-${docId}`,
        sourceCategory: "INSTITUTIONAL" as const,
        epistemicAxis: ["evidentiary"] as const,
        citation: {
          type: "article" as const,
          title: doc.name || "",
          slug: doc.slug?.current || "",
        },
        language: "en",
        contentType: "condition",
        accessLevel: "public" as const,
        sanityDocId: docId,
        sanityRev: doc._rev || "",
        editorialApproved: true,
        supersedes: null,
        lastVerifiedAt: new Date().toISOString(),
      },
      tokenCount: Math.ceil(content.length / 4),
    },
  ];
}

/* ── Full Corpus Ingestion ───────────────────────────────────────── */

export type IngestionResult = {
  source: string;
  count: number;
  errors: string[];
};

const DOCUMENT_TYPES_AND_ADAPTERS: [string, (id: string) => Promise<DocumentChunk[]>][] = [
  ["hadith", ingestHadith],
  ["quranReferenceDoc", ingestQuranReference],
  ["article", ingestArticle],
  ["product", ingestProduct],
  ["researchPaper", ingestResearchPaper],
  ["programme", ingestProgramme],
  ["ingredient", ingestIngredient],
  ["condition", ingestCondition],
];

export async function ingestAllDocuments(): Promise<{
  chunks: DocumentChunk[];
  results: IngestionResult[];
}> {
  const allChunks: DocumentChunk[] = [];
  const results: IngestionResult[] = [];

  for (const [docType, adapter] of DOCUMENT_TYPES_AND_ADAPTERS) {
    const docs: { _id: string }[] = await client.fetch(
      `*[_type == $type && !(_id in path("drafts.**"))]{ _id }`,
      { type: docType }
    );

    const errors: string[] = [];
    let count = 0;

    for (const doc of docs) {
      try {
        const chunks = await adapter(doc._id);
        allChunks.push(...chunks);
        count += chunks.length;
      } catch (err) {
        errors.push(`${doc._id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    results.push({ source: docType, count, errors });
  }

  // FAQs are batch-ingested
  try {
    const faqChunks = await ingestFaqs();
    allChunks.push(...faqChunks);
    results.push({ source: "faq", count: faqChunks.length, errors: [] });
  } catch (err) {
    results.push({
      source: "faq",
      count: 0,
      errors: [err instanceof Error ? err.message : String(err)],
    });
  }

  return { chunks: allChunks, results };
}

/* ── Incremental Ingestion (single document) ─────────────────────── */

export async function ingestDocument(
  docType: string,
  docId: string
): Promise<DocumentChunk[]> {
  const entry = DOCUMENT_TYPES_AND_ADAPTERS.find(([t]) => t === docType);
  if (!entry) {
    console.warn(`No adapter for document type: ${docType}`);
    return [];
  }
  return entry[1](docId);
}
