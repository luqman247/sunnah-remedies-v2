/**
 * Chunking Strategies — Per Source Type (§5.3).
 *
 * Each source type has its own chunking strategy with hard rules:
 * - Qur'an: ayah-level child, surah-context parent. Never split an ayah.
 * - Hadith: whole narration = one chunk. Never split matn.
 * - Research: heading-aware semantic sections, ~512–800 tokens, 15% overlap.
 * - Articles: recursive heading-scoped.
 * - Products: field-structured record (no free chunking).
 * - Courses: transcript segment + lecture-parent.
 * - Policies: clause-level.
 */

import { createHash } from "crypto";
import type {
  SourceCategory,
  Citation,
  AccessLevel,
  AuthenticityGrade,
  EpistemicAxis,
  DocumentChunk,
  ProvenanceEnvelope,
} from "../../evidence-engine/types";
import { CATEGORY_AXES } from "../../evidence-engine/types";

/* ── Chunk ID Generation ─────────────────────────────────────────── */

export function generateChunkId(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/* ── Base Chunk Builder ──────────────────────────────────────────── */

interface ChunkInput {
  content: string;
  parentContent?: string;
  sourceCategory: SourceCategory;
  citation: Citation;
  language: string;
  contentType: string;
  accessLevel: AccessLevel;
  sanityDocId: string;
  sanityRev: string;
  editorialApproved: boolean;
  authenticityGrade?: AuthenticityGrade;
  headingPath?: string[];
  parentChunkId?: string;
}

function buildChunk(input: ChunkInput): DocumentChunk {
  const id = generateChunkId(input.content);
  const axes: EpistemicAxis[] =
    CATEGORY_AXES[input.sourceCategory] || [];

  const envelope: ProvenanceEnvelope = {
    chunkId: id,
    sourceCategory: input.sourceCategory,
    authenticityGrade: input.authenticityGrade,
    epistemicAxis: axes,
    citation: input.citation,
    language: input.language,
    contentType: input.contentType,
    accessLevel: input.accessLevel,
    sanityDocId: input.sanityDocId,
    sanityRev: input.sanityRev,
    editorialApproved: input.editorialApproved,
    parentChunkId: input.parentChunkId,
    supersedes: null,
    lastVerifiedAt: new Date().toISOString(),
  };

  return {
    id,
    content: input.content,
    envelope,
    parentContent: input.parentContent,
    headingPath: input.headingPath,
    tokenCount: estimateTokens(input.content),
  };
}

/* ── Qur'an Chunking (§5.3) ─────────────────────────────────────── */

export interface QuranAyah {
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  translation?: string;
  surahContext?: string;
}

export function chunkQuranAyah(
  ayah: QuranAyah,
  docId: string,
  rev: string,
  approved: boolean
): DocumentChunk {
  const content = [
    ayah.arabicText,
    ayah.translation ? `\nTranslation: ${ayah.translation}` : "",
  ].join("");

  return buildChunk({
    content,
    parentContent: ayah.surahContext,
    sourceCategory: "QURAN",
    citation: {
      type: "quran",
      surah: String(ayah.surahNumber),
      ayah: String(ayah.ayahNumber),
      surahName: ayah.surah,
    },
    language: "ar",
    contentType: "quran",
    accessLevel: "public",
    sanityDocId: docId,
    sanityRev: rev,
    editorialApproved: approved,
  });
}

/* ── Hadith Chunking (§5.3) ──────────────────────────────────────── */

export interface HadithRecord {
  arabicText?: string;
  translation?: string;
  collection: string;
  number: string;
  narrator?: string;
  grade: AuthenticityGrade;
  book?: string;
  topic?: string[];
  commentary?: string;
}

export function chunkHadith(
  hadith: HadithRecord,
  docId: string,
  rev: string,
  approved: boolean
): DocumentChunk {
  // Never split matn — whole narration is one chunk
  const parts: string[] = [];
  if (hadith.arabicText) parts.push(hadith.arabicText);
  if (hadith.translation) parts.push(`Translation: ${hadith.translation}`);
  if (hadith.narrator) parts.push(`Narrator: ${hadith.narrator}`);
  if (hadith.commentary) parts.push(`Commentary: ${hadith.commentary}`);

  const content = parts.join("\n\n");

  return buildChunk({
    content,
    sourceCategory: "SUNNAH",
    authenticityGrade: hadith.grade,
    citation: {
      type: "hadith",
      collection: hadith.collection,
      book: hadith.book,
      number: hadith.number,
      narrator: hadith.narrator,
      grade: hadith.grade,
    },
    language: hadith.arabicText ? "ar" : "en",
    contentType: "hadith",
    accessLevel: "public",
    sanityDocId: docId,
    sanityRev: rev,
    editorialApproved: approved,
  });
}

/* ── Research Paper Chunking (§5.3) ──────────────────────────────── */

export interface ResearchSection {
  heading: string;
  text: string;
  headingPath: string[];
}

export function chunkResearchPaper(
  paper: {
    title: string;
    authors: string[];
    journal?: string;
    year?: string;
    doi?: string;
    abstract?: string;
    sections: ResearchSection[];
  },
  docId: string,
  rev: string,
  approved: boolean
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const maxTokens = 800;
  const overlapRatio = 0.15;
  const fullText = paper.sections.map((s) => s.text).join("\n\n");

  const citation: Citation = {
    type: "research",
    title: paper.title,
    authors: paper.authors,
    journal: paper.journal,
    year: paper.year,
    doi: paper.doi,
  };

  // Abstract as its own chunk
  if (paper.abstract) {
    chunks.push(
      buildChunk({
        content: `Abstract: ${paper.abstract}`,
        parentContent: fullText.slice(0, 2000),
        sourceCategory: "RESEARCH",
        citation,
        language: "en",
        contentType: "research",
        accessLevel: "public",
        sanityDocId: docId,
        sanityRev: rev,
        editorialApproved: approved,
        headingPath: ["Abstract"],
      })
    );
  }

  // Heading-aware semantic sections
  for (const section of paper.sections) {
    const tokens = estimateTokens(section.text);
    if (tokens <= maxTokens) {
      chunks.push(
        buildChunk({
          content: section.text,
          parentContent: fullText.slice(0, 2000),
          sourceCategory: "RESEARCH",
          citation,
          language: "en",
          contentType: "research",
          accessLevel: "public",
          sanityDocId: docId,
          sanityRev: rev,
          editorialApproved: approved,
          headingPath: section.headingPath,
        })
      );
    } else {
      // Split with overlap
      const subChunks = splitWithOverlap(
        section.text,
        maxTokens,
        overlapRatio
      );
      for (const sub of subChunks) {
        chunks.push(
          buildChunk({
            content: sub,
            parentContent: section.text,
            sourceCategory: "RESEARCH",
            citation,
            language: "en",
            contentType: "research",
            accessLevel: "public",
            sanityDocId: docId,
            sanityRev: rev,
            editorialApproved: approved,
            headingPath: section.headingPath,
          })
        );
      }
    }
  }

  return chunks;
}

/* ── Article / Editorial Chunking (§5.3) ─────────────────────────── */

export function chunkArticle(
  article: {
    title: string;
    author?: string;
    slug: string;
    publishedAt?: string;
    sections: { heading: string; text: string; headingPath: string[] }[];
    fullText: string;
  },
  docId: string,
  rev: string,
  approved: boolean,
  sourceCategory: SourceCategory = "INSTITUTIONAL"
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const maxTokens = 512;
  const overlapRatio = 0.15;

  const citation: Citation = {
    type: "article",
    title: article.title,
    author: article.author,
    slug: article.slug,
    publishedAt: article.publishedAt,
  };

  for (const section of article.sections) {
    const tokens = estimateTokens(section.text);
    if (tokens <= maxTokens) {
      chunks.push(
        buildChunk({
          content: section.text,
          parentContent: article.fullText.slice(0, 2000),
          sourceCategory,
          citation,
          language: "en",
          contentType: "article",
          accessLevel: "public",
          sanityDocId: docId,
          sanityRev: rev,
          editorialApproved: approved,
          headingPath: section.headingPath,
        })
      );
    } else {
      const subChunks = splitWithOverlap(section.text, maxTokens, overlapRatio);
      for (const sub of subChunks) {
        chunks.push(
          buildChunk({
            content: sub,
            parentContent: section.text,
            sourceCategory,
            citation,
            language: "en",
            contentType: "article",
            accessLevel: "public",
            sanityDocId: docId,
            sanityRev: rev,
            editorialApproved: approved,
            headingPath: section.headingPath,
          })
        );
      }
    }
  }

  return chunks;
}

/* ── Product Chunking (§5.3) ─────────────────────────────────────── */

export function chunkProduct(
  product: {
    id: string;
    title: string;
    handle?: string;
    description?: string;
    ingredients?: string[];
    benefits?: string[];
    usage?: string;
    warnings?: string[];
    contraindications?: string[];
    preparation?: string;
    evidence?: string;
  },
  docId: string,
  rev: string,
  approved: boolean
): DocumentChunk {
  // Products are field-structured records, not free-chunked
  const parts: string[] = [`Product: ${product.title}`];
  if (product.description) parts.push(`Description: ${product.description}`);
  if (product.ingredients?.length)
    parts.push(`Ingredients: ${product.ingredients.join(", ")}`);
  if (product.benefits?.length)
    parts.push(`Benefits: ${product.benefits.join("; ")}`);
  if (product.usage) parts.push(`Usage: ${product.usage}`);
  if (product.preparation) parts.push(`Preparation: ${product.preparation}`);
  if (product.warnings?.length)
    parts.push(`Warnings: ${product.warnings.join("; ")}`);
  if (product.contraindications?.length)
    parts.push(`Contraindications: ${product.contraindications.join("; ")}`);
  if (product.evidence) parts.push(`Evidence: ${product.evidence}`);

  return buildChunk({
    content: parts.join("\n"),
    sourceCategory: "INSTITUTIONAL",
    citation: {
      type: "product",
      productId: product.id,
      title: product.title,
      shopifyHandle: product.handle,
    },
    language: "en",
    contentType: "product",
    accessLevel: "public",
    sanityDocId: docId,
    sanityRev: rev,
    editorialApproved: approved,
  });
}

/* ── Course Chunking (§5.3) ──────────────────────────────────────── */

export function chunkCourseLecture(
  lecture: {
    courseId: string;
    lectureId: string;
    title: string;
    transcript: string;
    timestamp?: string;
    courseTitle: string;
  },
  docId: string,
  rev: string,
  approved: boolean,
  accessLevel: AccessLevel = "student"
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const maxTokens = 600;
  const subChunks = splitWithOverlap(lecture.transcript, maxTokens, 0.1);

  for (const sub of subChunks) {
    chunks.push(
      buildChunk({
        content: sub,
        parentContent: lecture.transcript.slice(0, 2000),
        sourceCategory: "INSTITUTIONAL",
        citation: {
          type: "course",
          courseId: lecture.courseId,
          lectureId: lecture.lectureId,
          timestamp: lecture.timestamp,
        },
        language: "en",
        contentType: "course",
        accessLevel,
        sanityDocId: docId,
        sanityRev: rev,
        editorialApproved: approved,
        headingPath: [lecture.courseTitle, lecture.title],
      })
    );
  }

  return chunks;
}

/* ── FAQ Chunking ────────────────────────────────────────────────── */

export function chunkFaq(
  faq: { question: string; answer: string; department?: string },
  docId: string,
  rev: string,
  approved: boolean
): DocumentChunk {
  return buildChunk({
    content: `Q: ${faq.question}\nA: ${faq.answer}`,
    sourceCategory: "INSTITUTIONAL",
    citation: {
      type: "article",
      title: faq.question,
      slug: docId,
    },
    language: "en",
    contentType: "faq",
    accessLevel: "public",
    sanityDocId: docId,
    sanityRev: rev,
    editorialApproved: approved,
  });
}

/* ── Policy Chunking (§5.3) ──────────────────────────────────────── */

export function chunkPolicy(
  policy: {
    id: string;
    title: string;
    clauses: { id: string; text: string; version: string }[];
  },
  docId: string,
  rev: string,
  approved: boolean
): DocumentChunk[] {
  return policy.clauses.map((clause) =>
    buildChunk({
      content: clause.text,
      sourceCategory: "INSTITUTIONAL",
      citation: {
        type: "policy",
        policyId: policy.id,
        clause: clause.id,
        version: clause.version,
      },
      language: "en",
      contentType: "policy",
      accessLevel: "public",
      sanityDocId: docId,
      sanityRev: rev,
      editorialApproved: approved,
    })
  );
}

/* ── Text Splitting Utility ──────────────────────────────────────── */

function splitWithOverlap(
  text: string,
  maxTokens: number,
  overlapRatio: number
): string[] {
  const sentences = text.split(/(?<=[.!?。])\s+/);
  const chunks: string[] = [];
  let current: string[] = [];
  let currentTokens = 0;
  const overlapTokens = Math.floor(maxTokens * overlapRatio);

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokens(sentence);
    if (currentTokens + sentenceTokens > maxTokens && current.length > 0) {
      chunks.push(current.join(" "));

      // Keep overlap
      const overlapSentences: string[] = [];
      let overlapCount = 0;
      for (let i = current.length - 1; i >= 0; i--) {
        const t = estimateTokens(current[i]);
        if (overlapCount + t > overlapTokens) break;
        overlapSentences.unshift(current[i]);
        overlapCount += t;
      }
      current = overlapSentences;
      currentTokens = overlapCount;
    }
    current.push(sentence);
    currentTokens += sentenceTokens;
  }

  if (current.length > 0) {
    chunks.push(current.join(" "));
  }

  return chunks.length > 0 ? chunks : [text];
}
