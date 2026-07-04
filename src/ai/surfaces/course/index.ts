/**
 * AI Course Assistant Surface (§7.4 / Milestone 7).
 *
 * Inside every course. Access-gated by course enrolment.
 * Supports summaries, flashcards, revision notes, quizzes,
 * Arabic explanations, clinical terminology, study assistance.
 */

import { runInputGuardrails } from "../../guardrails/input";
import { runOutputGuardrails, selectDisclaimers } from "../../guardrails/output";
import { parseQuery, hybridSearch } from "../../retrieval/hybrid";
import { rerank } from "../../retrieval/rerank";
import { assessConfidence, generateFallback } from "../../retrieval/confidence";
import { assembleContext } from "../../evidence-engine";
import { generateGroundedResponse } from "../../generation";
import { assembleSystemPrompt } from "../../prompts";
import { getGenerationProvider } from "../../generation/provider";
import { AI_CONFIG } from "../../config";
import type { StructuredResponse } from "../../evidence-engine/types";
import type { FallbackResponse } from "../../retrieval/confidence";

export type CourseAiMode =
  | "explain"
  | "summarise"
  | "flashcards"
  | "revision_notes"
  | "quiz"
  | "terminology"
  | "practice_questions"
  | "compare";

export interface CourseQueryOptions {
  query: string;
  courseId: string;
  lectureId?: string;
  mode: CourseAiMode;
  language?: string;
  sessionId?: string;
}

export interface CourseQueryResult {
  success: boolean;
  response?: StructuredResponse;
  fallback?: FallbackResponse;
  escalation?: { type: string; message: string; action: string };
  studyContent?: StudyContent;
}

export interface StudyContent {
  type: CourseAiMode;
  items: StudyItem[];
}

export interface StudyItem {
  question?: string;
  answer?: string;
  front?: string;
  back?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
}

export async function queryCourseAssistant(
  options: CourseQueryOptions
): Promise<CourseQueryResult> {
  const inputCheck = runInputGuardrails(options.query);

  if (!inputCheck.safe && inputCheck.escalation) {
    return { success: false, escalation: inputCheck.escalation };
  }

  const sanitisedQuery = inputCheck.sanitisedQuery || options.query;
  const language = options.language || inputCheck.detectedLanguage;

  // Scope retrieval to the specific course
  const parsedQuery = parseQuery(sanitisedQuery, {
    language,
    accessLevel: "student",
    surfaceScope: "course",
  });

  const retrievalResult = await hybridSearch(parsedQuery);
  const reranked = rerank(sanitisedQuery, retrievalResult.chunks, retrievalResult.scores);
  const confidence = assessConfidence(sanitisedQuery, reranked.chunks, reranked.scores);

  if (!confidence.shouldAnswer) {
    return {
      success: false,
      fallback: generateFallback(sanitisedQuery, reranked.chunks),
    };
  }

  // For structured study content modes, use specialised generation
  if (["flashcards", "quiz", "revision_notes", "practice_questions"].includes(options.mode)) {
    const studyContent = await generateStudyContent(
      options.mode,
      sanitisedQuery,
      reranked.chunks.map((c) => c.content).join("\n\n"),
      language
    );
    return { success: true, studyContent };
  }

  const context = assembleContext(reranked.chunks, AI_CONFIG.retrieval.maxParentContextTokens);
  const disclaimers = selectDisclaimers(sanitisedQuery, language);

  const response = await generateGroundedResponse({
    systemPrompt: assembleSystemPrompt("course"),
    query: sanitisedQuery,
    context,
    surface: "course",
    language,
    disclaimers,
  });

  const guarded = runOutputGuardrails(response, sanitisedQuery, language);
  return { success: true, response: guarded };
}

async function generateStudyContent(
  mode: CourseAiMode,
  query: string,
  contextText: string,
  language: string
): Promise<StudyContent> {
  const provider = getGenerationProvider();

  const modeInstructions: Record<string, string> = {
    flashcards: `Generate study flashcards from the course material. Return JSON:
{"type":"flashcards","items":[{"front":"Term or concept","back":"Definition or explanation"}]}`,
    quiz: `Generate a quiz from the course material. Return JSON:
{"type":"quiz","items":[{"question":"...","options":["A","B","C","D"],"correctAnswer":"A","explanation":"..."}]}`,
    revision_notes: `Generate concise revision notes from the course material. Return JSON:
{"type":"revision_notes","items":[{"text":"Key point or concept"}]}`,
    practice_questions: `Generate practice questions from the course material. Return JSON:
{"type":"practice_questions","items":[{"question":"...","answer":"...","explanation":"..."}]}`,
  };

  const response = await provider.generate({
    systemPrompt: assembleSystemPrompt("course"),
    userMessage: `${modeInstructions[mode] || modeInstructions.flashcards}

COURSE MATERIAL:
${contextText.slice(0, 6000)}

QUERY: ${query}
Generate 5-10 items based on the course material only.`,
    responseFormat: "json",
  });

  try {
    let content = response.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    return JSON.parse(content);
  } catch {
    return { type: mode, items: [] };
  }
}
