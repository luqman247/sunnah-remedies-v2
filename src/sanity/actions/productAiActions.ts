/**
 * Studio document actions for AI product content — generate, approve, reject.
 * Never publishes AI text automatically.
 */

"use client";

import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from "sanity";

type ProductAiFields = {
  name?: string;
  nature?: string;
  institutionalSummary?: string;
  botanicalName?: string;
  volume?: string;
  language?: string;
  aiDraft?: {
    reviewStatus?: string;
    shortDescription?: string;
    fullDescription?: unknown;
    notes?: string;
  };
};

function currentDoc(props: DocumentActionProps): ProductAiFields {
  return (props.draft || props.published || {}) as ProductAiFields;
}

function textToBlocks(text: string): Array<Record<string, unknown>> {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      _type: "block",
      _key: `ai${index}${Date.now().toString(36)}`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `s${index}`,
          text: line,
          marks: [],
        },
      ],
    }));
}

function blocksToPlainText(blocks: unknown): string {
  if (typeof blocks === "string") return blocks;
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      const b = block as { children?: { text?: string }[] };
      return (b.children || []).map((c) => c.text || "").join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

async function callGenerateApi(
  body: Record<string, unknown>,
  sanityToken: string,
) {
  if (!sanityToken) {
    throw new Error("Sign in to Sanity Studio to generate AI drafts");
  }
  const response = await fetch("/api/apothecary/generate-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sanityToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error || `Generation failed (${response.status})`);
  }
  return response.json() as Promise<{
    draft: {
      shortDescription?: string;
      fullDescription?: string;
      keyQualities?: string[];
      productStory?: string;
      sourcingParagraph?: string;
      howToUse?: string;
      seoTitle?: string;
      metaDescription?: string;
      warnings?: string[];
      generatedAt: string;
      provider: string;
      reviewStatus: string;
    };
  }>;
}

export const GenerateProductAiAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2024-01-01" });
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentDoc(props);

  return {
    label: "Generate AI description",
    title: "Create a review-required draft. Does not publish.",
    disabled: !product.name || Boolean(patch.disabled),
    onHandle: async () => {
      try {
        const sanityToken = client.config().token || "";
        const { draft } = await callGenerateApi(
          {
            name: product.name,
            category: product.nature,
            formatOrSize: product.volume,
            language: product.language === "da" ? "da" : "en",
            existingShortDescription: product.institutionalSummary,
            existingFullDescription: product.nature,
            action: "generate_description",
          },
          sanityToken,
        );

        const fullParts = [
          draft.fullDescription,
          draft.productStory,
          draft.sourcingParagraph,
          draft.howToUse,
          draft.keyQualities?.length
            ? `Key qualities: ${draft.keyQualities.join("; ")}`
            : null,
        ]
          .filter(Boolean)
          .join("\n\n");

        const notes = [
          ...(draft.warnings || []),
          draft.seoTitle ? `SEO title suggestion: ${draft.seoTitle}` : null,
          draft.metaDescription
            ? `Meta description suggestion: ${draft.metaDescription}`
            : null,
        ]
          .filter(Boolean)
          .join("\n");

        patch.execute([
          {
            set: {
              aiDraft: {
                reviewStatus: "review-required",
                shortDescription: draft.shortDescription || "",
                fullDescription: fullParts ? textToBlocks(fullParts) : [],
                generatedAt: draft.generatedAt,
                provider: draft.provider,
                notes,
              },
            },
          },
        ]);
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : "AI generation failed",
        );
      } finally {
        props.onComplete();
      }
    },
  };
};

export const ApproveProductAiDraftAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentDoc(props);
  const draft = product.aiDraft;
  const ready = draft?.reviewStatus === "review-required";

  if (!ready) return null;

  return {
    label: "Approve AI draft into fields",
    title:
      "Copy approved draft into institutional summary (and historical context if empty). Still requires Publish.",
    disabled: Boolean(patch.disabled),
    onHandle: () => {
      const plain = blocksToPlainText(draft?.fullDescription);
      const paragraphs = plain
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      const next: Record<string, unknown> = {
        "aiDraft.reviewStatus": "approved",
      };

      if (draft?.shortDescription) {
        next.institutionalSummary = draft.shortDescription;
      }

      // Only fill historical context when empty — never overwrite scholarship silently
      const existingHistorical = (
        (props.draft || props.published) as { historicalContext?: string[] }
      )?.historicalContext;
      if ((!existingHistorical || existingHistorical.length === 0) && paragraphs.length) {
        next.historicalContext = paragraphs;
      }

      patch.execute([{ set: next }]);
      props.onComplete();
    },
  };
};

export const RejectProductAiDraftAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentDoc(props);
  const ready = product.aiDraft?.reviewStatus === "review-required";

  if (!ready) return null;

  return {
    label: "Reject AI draft",
    tone: "critical",
    disabled: Boolean(patch.disabled),
    onHandle: () => {
      patch.execute([{ set: { "aiDraft.reviewStatus": "rejected" } }]);
      props.onComplete();
    },
  };
};

export const PRODUCT_AI_DOCUMENT_ACTIONS = [
  GenerateProductAiAction,
  ApproveProductAiDraftAction,
  RejectProductAiDraftAction,
] as const;
