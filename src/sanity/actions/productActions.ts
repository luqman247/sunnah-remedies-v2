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
import {
  buildProductDraftPreviewUrl,
  productPublicPath,
} from "@/sanity/lib/product-preview";

type ProductFields = {
  _id?: string;
  status?: string;
  featured?: boolean;
  visibleInApothecary?: boolean;
  slug?: { current?: string };
  language?: string;
  name?: string;
};

function currentProduct(props: DocumentActionProps): ProductFields {
  const base = (props.draft || props.published || {}) as ProductFields;
  return { ...base, _id: props.id };
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

export const HideProductAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const product = currentProduct(props);
  const alreadyHidden = product.visibleInApothecary === false;

  if (product.status === "archived") return null;

  return {
    label: alreadyHidden ? "Show in Apothecary" : "Hide Product",
    disabled: isPatchDisabled(patch.disabled),
    title: alreadyHidden
      ? "Set visible in Apothecary (still respects status)"
      : "Hide from the public catalogue without archiving",
    onHandle: () => {
      patch.execute([
        {
          set: {
            visibleInApothecary: alreadyHidden,
          },
        },
      ]);
      props.onComplete();
    },
  };
};

export const OpenSellerCentreAction: DocumentActionComponent = (props) => {
  const id = props.id.replace(/^drafts\./, "");

  return {
    label: "Open in Seller Centre",
    title: "Open the simplified Apothecary Seller Centre for this product",
    onHandle: () => {
      const base = `${window.location.origin}/studio/apothecary-manager`;
      window.location.assign(`${base}?edit=${encodeURIComponent(id)}`);
      props.onComplete();
    },
  };
};

/**
 * Preview Draft — enables Next.js Draft Mode and opens the locale-correct
 * monograph. Works for unpublished and Hidden products without publishing.
 */
export const PreviewDraftProductAction: DocumentActionComponent = (props) => {
  const product = currentProduct(props);
  const path = productPublicPath(product);
  const previewUrl = buildProductDraftPreviewUrl({
    ...product,
    _id: props.id,
  });

  return {
    label: "Preview Draft",
    disabled: !path,
    title: previewUrl
      ? "Open a private draft preview (not publicly visible)"
      : path
        ? "Configure SANITY_STUDIO_PREVIEW_SECRET (same value as SANITY_PREVIEW_SECRET)"
        : "Add a slug before previewing",
    onHandle: () => {
      // Never fall back to the public monograph URL — draft/hidden products
      // would open a 404 and look like preview is broken.
      if (!previewUrl) {
        props.onComplete();
        return;
      }
      window.open(previewUrl, "_blank", "noopener,noreferrer");
      props.onComplete();
    },
  };
};

/** @deprecated Prefer PreviewDraftProductAction */
export const PreviewProductAction = PreviewDraftProductAction;

export const PRODUCT_DOCUMENT_ACTIONS = [
  PreviewDraftProductAction,
  OpenSellerCentreAction,
  HideProductAction,
  ArchiveProductAction,
  RestoreProductAction,
  SetActiveProductAction,
  ToggleFeaturedProductAction,
] as const;

export {
  GenerateProductAiAction,
  ApproveProductAiDraftAction,
  RejectProductAiDraftAction,
  PRODUCT_AI_DOCUMENT_ACTIONS,
} from "./productAiActions";
