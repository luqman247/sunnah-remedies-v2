/**
 * AI Consultation Assistant Surface (§7.3 / Milestone 6).
 *
 * Structured pre-booking intake. Collects symptoms, goals,
 * medical history, current treatment, lifestyle. Generates
 * intake summary and clinician briefing. Never diagnoses.
 */

import { runInputGuardrails } from "../../guardrails/input";
import { runOutputGuardrails, selectDisclaimers } from "../../guardrails/output";
import { parseQuery, hybridSearch } from "../../retrieval/hybrid";
import { rerank } from "../../retrieval/rerank";
import { assembleContext } from "../../evidence-engine";
import { generateGroundedResponse } from "../../generation";
import { assembleSystemPrompt } from "../../prompts";
import { getGenerationProvider } from "../../generation/provider";
import { AI_CONFIG } from "../../config";
import type { StructuredResponse, AccessLevel } from "../../evidence-engine/types";

/* ── Intake Data Model ───────────────────────────────────────────── */

export interface IntakeData {
  symptoms?: string[];
  goals?: string[];
  duration?: string;
  currentTreatment?: string[];
  medicalHistory?: string[];
  lifestyle?: string[];
  preferences?: string[];
}

export interface ConsultationStep {
  step: number;
  totalSteps: number;
  question: string;
  field: keyof IntakeData;
  inputType: "text" | "multi_select" | "single_select";
  options?: string[];
}

export interface IntakeSummary {
  summary: string;
  recommendedConsultationType: string;
  educationalResources: { title: string; slug: string }[];
  suggestedProducts: { title: string; slug: string }[];
  clinicianQuestions: string[];
}

/* ── Intake Flow Steps ───────────────────────────────────────────── */

const INTAKE_STEPS: ConsultationStep[] = [
  {
    step: 1,
    totalSteps: 6,
    question: "What symptoms or concerns would you like to discuss with a practitioner?",
    field: "symptoms",
    inputType: "text",
  },
  {
    step: 2,
    totalSteps: 6,
    question: "What are your health goals?",
    field: "goals",
    inputType: "text",
  },
  {
    step: 3,
    totalSteps: 6,
    question: "How long have you been experiencing these symptoms?",
    field: "duration",
    inputType: "single_select",
    options: [
      "Less than a week",
      "1–4 weeks",
      "1–3 months",
      "3–6 months",
      "6–12 months",
      "More than a year",
    ],
  },
  {
    step: 4,
    totalSteps: 6,
    question: "Are you currently taking any medications or treatments?",
    field: "currentTreatment",
    inputType: "text",
  },
  {
    step: 5,
    totalSteps: 6,
    question: "Do you have any relevant medical history?",
    field: "medicalHistory",
    inputType: "text",
  },
  {
    step: 6,
    totalSteps: 6,
    question: "Please describe your lifestyle — diet, exercise, sleep, stress levels.",
    field: "lifestyle",
    inputType: "text",
  },
];

export function getIntakeStep(stepNumber: number): ConsultationStep | null {
  return INTAKE_STEPS.find((s) => s.step === stepNumber) ?? null;
}

export function getIntakeSteps(): ConsultationStep[] {
  return INTAKE_STEPS;
}

/* ── Intake Summary Generation ───────────────────────────────────── */

export async function generateIntakeSummary(
  intake: IntakeData,
  language: string = "en"
): Promise<IntakeSummary> {
  const provider = getGenerationProvider();

  const intakeText = [
    intake.symptoms?.length ? `Symptoms: ${intake.symptoms.join(", ")}` : "",
    intake.goals?.length ? `Goals: ${intake.goals.join(", ")}` : "",
    intake.duration ? `Duration: ${intake.duration}` : "",
    intake.currentTreatment?.length ? `Current treatment: ${intake.currentTreatment.join(", ")}` : "",
    intake.medicalHistory?.length ? `Medical history: ${intake.medicalHistory.join(", ")}` : "",
    intake.lifestyle?.length ? `Lifestyle: ${intake.lifestyle.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await provider.generate({
    systemPrompt: assembleSystemPrompt("consultation"),
    userMessage: `Generate a structured intake summary for the following patient information. 
This will be used to brief the clinician before a consultation.

PATIENT INTAKE:
${intakeText}

Respond with a JSON object:
{
  "summary": "Brief narrative summary of the patient's presentation",
  "recommendedConsultationType": "general|hijamah|nutrition|herbal|comprehensive",
  "educationalResources": [{"title": "...", "slug": "..."}],
  "suggestedProducts": [{"title": "...", "slug": "..."}],
  "clinicianQuestions": ["Questions the clinician may want to explore"]
}

REMEMBER: You are preparing a briefing, not diagnosing. The clinician makes all clinical decisions.`,
    responseFormat: "json",
  });

  try {
    let content = response.content.trim();
    if (content.startsWith("```")) {
      content = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    return JSON.parse(content);
  } catch {
    return {
      summary: "Intake data collected for clinician review.",
      recommendedConsultationType: "general",
      educationalResources: [],
      suggestedProducts: [],
      clinicianQuestions: [],
    };
  }
}

/* ── Conversational Intake Query ─────────────────────────────────── */

export async function queryConsultationAssistant(options: {
  query: string;
  intake: IntakeData;
  currentStep: number;
  language?: string;
  accessLevel?: AccessLevel;
}): Promise<{
  success: boolean;
  response?: StructuredResponse;
  nextStep?: ConsultationStep | null;
  intakeSummary?: IntakeSummary;
  escalation?: { type: string; message: string; action: string };
}> {
  const inputCheck = runInputGuardrails(options.query);

  if (!inputCheck.safe && inputCheck.escalation) {
    return { success: false, escalation: inputCheck.escalation };
  }

  const language = options.language || inputCheck.detectedLanguage;

  // If all steps completed, generate summary
  if (options.currentStep > INTAKE_STEPS.length) {
    const summary = await generateIntakeSummary(options.intake, language);
    return { success: true, intakeSummary: summary };
  }

  // Otherwise, retrieve context for educational enrichment
  const sanitisedQuery = inputCheck.sanitisedQuery || options.query;
  const parsedQuery = parseQuery(sanitisedQuery, {
    language,
    accessLevel: options.accessLevel,
  });

  const retrievalResult = await hybridSearch(parsedQuery);
  const reranked = rerank(sanitisedQuery, retrievalResult.chunks, retrievalResult.scores);
  const context = assembleContext(reranked.chunks, AI_CONFIG.retrieval.maxParentContextTokens);
  const disclaimers = selectDisclaimers(sanitisedQuery, language);

  const response = await generateGroundedResponse({
    systemPrompt: assembleSystemPrompt("consultation"),
    query: sanitisedQuery,
    context,
    surface: "consultation",
    language,
    disclaimers,
  });

  const guarded = runOutputGuardrails(response, sanitisedQuery, language);
  const nextStep = getIntakeStep(options.currentStep + 1);

  return { success: true, response: guarded, nextStep };
}
