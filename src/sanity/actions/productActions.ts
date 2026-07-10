/**
 * Apothecary product document actions — archive, activate, feature, preview.
 *
 * Built-in Publish / Duplicate / Discard remain. Archive is preferred over delete
 * for editorial safety (product history stays recoverable).
 */

"use client";

import {
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from "sanity";

type ProductFields = {
  status?: string;
  featured?: boolean;
  visibleInApothecary?: boolean;
  slug?: { current?: string };
  language?: string;
  name?: string;
};

function currentProduct(props: DocumentActionProps): ProductFields {
  return (props.draft || props.published || {}) as ProductFields;
}

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SANITY_STUDIO_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
  );
}

function previewSecret(): string | undefined {
  return (
    process.env.SANITY_STUDIO_PREVIEW_SECRET ||
    process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET ||
    undefined
  );
}

function productPublicPath(product: ProductFields): string | null {
  const slug = product.slug?.current;
  if (!slug) return null;
  const prefix = product.language === "da" ? "/dk" : "";
  return `${prefix}/the-apothecary/${slug}`;
}

function isPatchDisabled(disabled: unknown): boolean {
  return Boolean(disabled);
}

export const ArchiveProductAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentProduct(props);
  const alreadyArchived = product.status === "archived";

  return {
    label: "Archive product",
    tone: "critical",
    disabled: alreadyArchived || isPatchDisabled(patch.disabled),
    title: alreadyArchived
      ? "Already archived"
      : "Set status to archived and hide from the Apothecary",
    onHandle: () => {
      patch.execute([
        {
          set: {
            status: "archived",
            visibleInApothecary: false,
            featured: false,
          },
        },
      ]);
      props.onComplete();
    },
  };
};

export const RestoreProductAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentProduct(props);
  const isArchived = product.status === "archived";

  if (!isArchived) return null;

  return {
    label: "Restore to draft",
    disabled: isPatchDisabled(patch.disabled),
    title: "Move from archived back to draft for editing",
    onHandle: () => {
      patch.execute([
        {
          set: {
            status: "draft",
            visibleInApothecary: false,
          },
        },
      ]);
      props.onComplete();
    },
  };
};

export const SetActiveProductAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentProduct(props);
  const isActive = product.status === "active";

  return {
    label: isActive ? "Mark as draft" : "Mark as active",
    disabled: isPatchDisabled(patch.disabled),
    title: isActive
      ? "Return to draft (still published in Sanity until you unpublish)"
      : "Set publication status to active and show in Apothecary",
    onHandle: () => {
      if (isActive) {
        patch.execute([
          {
            set: {
              status: "draft",
              visibleInApothecary: false,
            },
          },
        ]);
      } else {
        patch.execute([
          {
            set: {
              status: "active",
              visibleInApothecary: true,
              publishedAt: new Date().toISOString(),
            },
          },
        ]);
      }
      props.onComplete();
    },
  };
};

export const ToggleFeaturedProductAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentProduct(props);
  const featured = Boolean(product.featured);

  return {
    label: featured ? "Remove from featured" : "Mark as featured",
    disabled: isPatchDisabled(patch.disabled) || product.status === "archived",
    title: featured
      ? "Remove featured flag"
      : "Feature this product on the Apothecary",
    onHandle: () => {
      patch.execute([
        {
          set: {
            featured: !featured,
            ...(featured ? {} : { featuredPriority: 10 }),
          },
        },
      ]);
      props.onComplete();
    },
  };
};

export const PreviewProductAction: DocumentActionComponent = (props) => {
  const product = currentProduct(props);
  const path = productPublicPath(product);
  const secret = previewSecret();

  return {
    label: "Preview on site",
    disabled: !path,
    title: path
      ? "Open the product page (draft mode when preview secret is configured)"
      : "Add a slug before previewing",
    onHandle: () => {
      if (!path) {
        props.onComplete();
        return;
      }
      const origin = siteOrigin().replace(/\/$/, "");
      const url = secret
        ? `${origin}/api/draft?secret=${encodeURIComponent(secret)}&slug=${encodeURIComponent(path)}`
        : `${origin}${path}`;
      window.open(url, "_blank", "noopener,noreferrer");
      props.onComplete();
    },
  };
};

export const PRODUCT_DOCUMENT_ACTIONS = [
  ArchiveProductAction,
  RestoreProductAction,
  SetActiveProductAction,
  ToggleFeaturedProductAction,
  PreviewProductAction,
] as const;

export {
  GenerateProductAiAction,
  ApproveProductAiDraftAction,
  RejectProductAiDraftAction,
  PRODUCT_AI_DOCUMENT_ACTIONS,
} from "./productAiActions";
