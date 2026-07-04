/**
 * Input Guardrails (§9.1).
 *
 * Classifies incoming queries for:
 * - Emergency / red-flag symptoms → immediate escalation
 * - Fatwā requests → decline + route to scholars
 * - Diagnosis / prescription requests → decline + route to clinical
 * - Prompt injection attempts → block
 * - PII detection → strip
 * - Language detection
 * - Out-of-scope detection
 */

/* ── Query Classification ────────────────────────────────────────── */

export type QueryClassification =
  | "safe"
  | "emergency"
  | "diagnosis_request"
  | "prescription_request"
  | "fatwa_request"
  | "prompt_injection"
  | "contains_pii"
  | "out_of_scope";

export interface InputGuardrailResult {
  classification: QueryClassification;
  safe: boolean;
  escalation?: {
    type: string;
    message: string;
    action: string;
  };
  sanitisedQuery?: string;
  detectedLanguage: string;
}

/* ── Emergency Patterns (§9.8) ───────────────────────────────────── */

const EMERGENCY_PATTERNS = [
  /\b(suicid|kill\s*my\s*self|end\s*my\s*life|want\s*to\s*die)\b/i,
  /\b(heart\s*attack|stroke|seizure|cannot\s*breathe|can'?t\s*breathe)\b/i,
  /\b(overdos|poison|severe\s*bleed|unconscious|not\s*breathing)\b/i,
  /\b(chest\s*pain.*radi|crushing\s*chest|sudden\s*weakness\s*one\s*side)\b/i,
  /\b(anaphyla|severe\s*allerg|swollen?\s*throat)\b/i,
  /\b(self[- ]?harm|hurting\s*myself)\b/i,
];

/* ── Diagnosis / Prescription Patterns ───────────────────────────── */

const DIAGNOSIS_PATTERNS = [
  /\b(do\s+i\s+have|diagnos\w*|what('?s| is)\s+wrong\s+with\s+me)\b/i,
  /\b(is\s+this\s+(cancer|serious|dangerous))\b/i,
  /\b(what\s+disease|what\s+condition\s+do\s+i)\b/i,
];

const PRESCRIPTION_PATTERNS = [
  /\b(prescri\w*|what\s+(should|must)\s+i\s+take|give\s+me\s+(a\s+)?dose)\b/i,
  /\b(how\s+much\s+(?:medicine|medication|drug)\s+should)\b/i,
  /\b(what\s+(?:medicine|medication|drug)\s+(?:should|do)\s+i)\b/i,
  /\b(treat(?:ment)?\s+plan\s+for\s+me)\b/i,
];

/* ── Fatwā Patterns (§9.6) ──────────────────────────────────────── */

const FATWA_PATTERNS = [
  /\b(fatw[aā])\b/i,
  /\b(halal|haram|permissible|forbidden)\b/i,
  /\b(what\s+is\s+the\s+(?:ruling|hukm|حكم))\b/i,
  /\b(give\s+(?:me\s+)?(?:a\s+)?(?:fatw[aā]|ruling))\b/i,
  /\b(حلال|حرام|فتوى)\b/,
];

/* ── Prompt Injection Patterns ───────────────────────────────────── */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts)/i,
  /you\s+are\s+now\s+(a\s+)?(different|new)\s+(ai|assistant|bot)/i,
  /system\s*:\s*/i,
  /\[INST\]|\[\/INST\]/i,
  /{{.*}}/,
  /<\|.*\|>/,
  /pretend\s+(you\s+are|to\s+be|you'?re)/i,
  /jailbreak|DAN\s+mode/i,
  /override\s+(your|the)\s+(instructions|rules|guardrails)/i,
];

/* ── PII Patterns ────────────────────────────────────────────────── */

const PII_PATTERNS = [
  { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: "email" },
  { regex: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, type: "phone" },
  { regex: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g, type: "ssn" },
  { regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, type: "credit_card" },
];

/* ── Language Detection ──────────────────────────────────────────── */

function detectLanguage(text: string): string {
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) return "ar";
  if (/[æøåÆØÅ]/.test(text)) return "da";
  return "en";
}

/* ── Main Guard ──────────────────────────────────────────────────── */

export function runInputGuardrails(query: string): InputGuardrailResult {
  const detectedLanguage = detectLanguage(query);

  // 1. Check for prompt injection first
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(query)) {
      return {
        classification: "prompt_injection",
        safe: false,
        escalation: {
          type: "security",
          message: "This query has been blocked for security reasons.",
          action: "block",
        },
        detectedLanguage,
      };
    }
  }

  // 2. Emergency detection
  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(query)) {
      return {
        classification: "emergency",
        safe: false,
        escalation: {
          type: "emergency",
          message:
            "If you or someone else is in immediate danger, please contact emergency services immediately. " +
            "In the UK, call 999. In the US, call 911. Internationally, contact your local emergency number. " +
            "If you are experiencing a mental health crisis, contact the Samaritans on 116 123 (UK) " +
            "or your local crisis support service.",
          action: "emergency_escalation",
        },
        detectedLanguage,
      };
    }
  }

  // 3. Fatwā request
  for (const pattern of FATWA_PATTERNS) {
    if (pattern.test(query)) {
      return {
        classification: "fatwa_request",
        safe: false,
        escalation: {
          type: "scholarly_referral",
          message:
            "The Institute does not issue religious rulings (fatāwā). For questions of Islamic jurisprudence, " +
            "please consult a qualified scholar or faculty member. We can present scholarly positions with their " +
            "sources and attribution.",
          action: "redirect_to_scholars",
        },
        detectedLanguage,
      };
    }
  }

  // 4. Diagnosis request
  for (const pattern of DIAGNOSIS_PATTERNS) {
    if (pattern.test(query)) {
      return {
        classification: "diagnosis_request",
        safe: false,
        escalation: {
          type: "clinical_consultation",
          message:
            "The Institute cannot provide medical diagnoses. For personalised medical assessment, " +
            "please book a clinical consultation with one of our qualified practitioners.",
          action: "redirect_to_consultation",
        },
        detectedLanguage,
      };
    }
  }

  // 5. Prescription request
  for (const pattern of PRESCRIPTION_PATTERNS) {
    if (pattern.test(query)) {
      return {
        classification: "prescription_request",
        safe: false,
        escalation: {
          type: "clinical_consultation",
          message:
            "The Institute cannot prescribe treatments. Our information is educational. " +
            "For personalised treatment guidance, please book a clinical consultation.",
          action: "redirect_to_consultation",
        },
        detectedLanguage,
      };
    }
  }

  // 6. PII detection and stripping
  let sanitisedQuery = query;
  let hasPii = false;
  for (const { regex } of PII_PATTERNS) {
    if (regex.test(sanitisedQuery)) {
      hasPii = true;
      sanitisedQuery = sanitisedQuery.replace(regex, "[REDACTED]");
    }
    regex.lastIndex = 0;
  }

  if (hasPii) {
    return {
      classification: "contains_pii",
      safe: true,
      sanitisedQuery,
      detectedLanguage,
    };
  }

  return {
    classification: "safe",
    safe: true,
    sanitisedQuery: query,
    detectedLanguage,
  };
}
