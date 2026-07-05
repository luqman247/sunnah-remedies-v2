"use client";

/**
 * Institutional AI Assistant — embedded in the existing UI.
 *
 * Uses existing design tokens and patterns. No new layouts,
 * typography, spacing, or colours. Renders within existing
 * institutional components.
 */

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { StructuredResponse, Claim, SourceCategory } from "@/ai/evidence-engine/types";
import { EVIDENCE_COLOUR_TOKENS } from "@/ai/evidence-engine/types";

/* ── Types ───────────────────────────────────────────────────────── */

interface AssistantProps {
  surface?: string;
  placeholder?: string;
  language?: string;
  courseId?: string;
  lectureId?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: StructuredResponse;
  escalation?: { type: string; message: string; action: string };
  fallback?: { type: string; message: string; suggestions?: string[] };
  timestamp: number;
}

/* ── Component ───────────────────────────────────────────────────── */

export function InstitutionalAssistant({
  surface = "knowledge",
  placeholder,
  language = "en",
  courseId,
  lectureId,
}: AssistantProps) {
  const t = useTranslations("ai");
  const resolvedPlaceholder = placeholder ?? t("placeholder");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(
    () => `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const query = input.trim();
      if (!query || loading) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: query,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/ai/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            surface,
            language,
            sessionId,
            courseId,
            lectureId,
          }),
        });

        const data = await res.json();

        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: data.response?.summary || data.fallback?.message || "",
          response: data.response,
          escalation: data.escalation,
          fallback: data.fallback,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: t("error"),
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, loading, surface, language, sessionId, courseId, lectureId, t]
  );

  return (
    <div className="ai-assistant">
      <div className="ai-assistant__header">
        <p className="section-label">{t("header")}</p>
      </div>

      <div className="ai-assistant__messages">
        {messages.length === 0 && (
          <div className="ai-assistant__empty">
            <p className="type-body" style={{ color: "var(--muted)" }}>
              {t("emptyState")}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ai-assistant__message ai-assistant__message--${msg.role}`}
          >
            {msg.role === "user" ? (
              <p className="type-body">{msg.content}</p>
            ) : (
              <AssistantResponse message={msg} />
            )}
          </div>
        ))}

        {loading && (
          <div className="ai-assistant__message ai-assistant__message--assistant">
            <div className="ai-assistant__loading">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="ai-assistant__input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={resolvedPlaceholder}
          className="ai-assistant__input"
          disabled={loading}
          aria-label={t("inputAriaLabel")}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="ai-assistant__submit"
          aria-label={t("submitAriaLabel")}
        >
          {t("submit")}
        </button>
      </form>
    </div>
  );
}

/* ── Assistant Response Rendering ────────────────────────────────── */

function AssistantResponse({ message }: { message: Message }) {
  const t = useTranslations("ai");

  if (message.escalation) {
    return (
      <div className="ai-assistant__escalation">
        <p className="type-body" style={{ fontWeight: 500 }}>
          {message.escalation.message}
        </p>
        {message.escalation.action === "emergency_escalation" && (
          <p
            className="type-body"
            style={{ color: "var(--oxblood)", marginTop: "var(--space-3)" }}
          >
            {t("emergencyWarning")}
          </p>
        )}
      </div>
    );
  }

  if (message.fallback) {
    return (
      <div className="ai-assistant__fallback">
        <p className="type-body">{message.fallback.message}</p>
        {message.fallback.suggestions && message.fallback.suggestions.length > 0 && (
          <div style={{ marginTop: "var(--space-4)" }}>
            <p className="type-folio" style={{ color: "var(--muted)" }}>
              {t("relatedTopics")}
            </p>
            <ul className="ai-assistant__suggestions">
              {message.fallback.suggestions.map((s, i) => (
                <li key={i} className="type-body">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (!message.response) {
    return <p className="type-body">{message.content}</p>;
  }

  const { response } = message;
  const grouped = groupClaimsByCategory(response.claims);

  return (
    <div className="ai-assistant__response">
      {/* Summary */}
      <p className="type-body" style={{ marginBottom: "var(--space-5)" }}>
        {response.summary}
      </p>

      {/* Evidence Provenance Panel */}
      {grouped.size > 0 && (
        <div className="ai-assistant__evidence">
          <p className="type-folio" style={{ color: "var(--muted)", marginBottom: "var(--space-3)" }}>
            {t("evidenceProvenance")}
          </p>
          {Array.from(grouped.entries()).map(([category, claims]) => (
            <EvidenceGroup key={category} category={category} claims={claims} />
          ))}
        </div>
      )}

      {/* Warnings */}
      {response.warnings.length > 0 && (
        <div className="ai-assistant__warnings" style={{ marginTop: "var(--space-5)" }}>
          {response.warnings.map((w, i) => (
            <p
              key={i}
              className="type-body"
              style={{ color: "var(--oxblood)" }}
            >
              {w}
            </p>
          ))}
        </div>
      )}

      {/* Related Content */}
      <RelatedContent related={response.related} />

      {/* Disclaimers */}
      {response.disclaimers.length > 0 && (
        <div className="ai-assistant__disclaimers">
          {response.disclaimers.map((d, i) => (
            <p key={i} className="type-caption" style={{ color: "var(--muted)" }}>
              {d}
            </p>
          ))}
        </div>
      )}

      {/* Escalation */}
      {response.escalation && (
        <div
          className="ai-assistant__escalation-note"
          style={{ marginTop: "var(--space-4)" }}
        >
          <p className="type-body" style={{ fontStyle: "italic" }}>
            {response.escalation.reason}
          </p>
          <a
            href={
              response.escalation.recommend === "clinical_consultation"
                ? "/consultations"
                : response.escalation.recommend === "course_enrolment"
                  ? "/the-academy"
                  : "/consultations"
            }
            className="type-body"
            style={{ color: "var(--sage)", textDecoration: "underline" }}
          >
            {response.escalation.recommend === "clinical_consultation"
              ? t("bookConsultation")
              : response.escalation.recommend === "course_enrolment"
                ? t("viewCourses")
                : t("learnMore")}
          </a>
        </div>
      )}
    </div>
  );
}

/* ── Evidence Group ──────────────────────────────────────────────── */

function EvidenceGroup({
  category,
  claims,
}: {
  category: SourceCategory;
  claims: Claim[];
}) {
  const t = useTranslations("ai");
  const token = EVIDENCE_COLOUR_TOKENS[category];
  return (
    <div className="ai-assistant__evidence-group" data-evidence={token}>
      <p
        className="type-folio"
        style={{
          color: "var(--sage)",
          borderBottom: "var(--hairline)",
          paddingBottom: "var(--space-2)",
          marginBottom: "var(--space-3)",
        }}
      >
        {t(`categories.${category}`)}
      </p>
      {claims.map((claim, i) => (
        <div key={i} className="ai-assistant__claim">
          <p className="type-body">{claim.text}</p>
          <span className="type-caption" style={{ color: "var(--muted)" }}>
            {t("confidence", { percent: Math.round(claim.confidence * 100) })}
            {claim.citations.length > 0 && ` · ${t("sources", { count: claim.citations.length })}`}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Related Content ─────────────────────────────────────────────── */

function RelatedContent({
  related,
}: {
  related: StructuredResponse["related"];
}) {
  const hasRelated =
    related.articles.length > 0 ||
    related.courses.length > 0 ||
    related.products.length > 0 ||
    related.consultations.length > 0;

  const t = useTranslations("ai");

  if (!hasRelated) return null;

  return (
    <div className="ai-assistant__related" style={{ marginTop: "var(--space-5)" }}>
      <p className="type-folio" style={{ color: "var(--muted)", marginBottom: "var(--space-3)" }}>
        {t("furtherReading")}
      </p>
      <div className="ai-assistant__related-grid">
        {related.articles.map((a) => (
          <a key={a.id} href={`/knowledge-library/${a.slug}`} className="ai-assistant__related-link">
            {a.title}
          </a>
        ))}
        {related.courses.map((c) => (
          <a key={c.id} href={`/the-academy/${c.slug}`} className="ai-assistant__related-link">
            {c.title}
          </a>
        ))}
        {related.products.map((p) => (
          <a key={p.id} href={`/the-apothecary/${p.slug}`} className="ai-assistant__related-link">
            {p.title}
          </a>
        ))}
        {related.consultations.map((c) => (
          <a key={c.id} href="/consultations" className="ai-assistant__related-link">
            {c.title}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────── */

function groupClaimsByCategory(
  claims: Claim[]
): Map<SourceCategory, Claim[]> {
  const grouped = new Map<SourceCategory, Claim[]>();
  for (const claim of claims) {
    const existing = grouped.get(claim.sourceCategory) || [];
    existing.push(claim);
    grouped.set(claim.sourceCategory, existing);
  }
  return grouped;
}
