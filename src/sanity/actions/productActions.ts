/**
 * Apothecary product document actions — archive, activate, feature, preview.
 *
 * Built-in Publish / Duplicate / Discard remain. Archive is preferred over delete
 * for editorial safety (product history stays recoverable).
 */

"use client";

import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
  type DocumentActionProps,
} from "sanity";
import {
  productPublicPath,
  requestProductDraftPreview,
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
 * Preview Draft — asks the server to enable Draft Mode after validating the
 * Studio user's Sanity token, then opens the locale-correct monograph.
 * Works for never-published and Hidden products without publishing.
 */
export const PreviewDraftProductAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2024-01-01" });
  const product = currentProduct(props);
  const path = productPublicPath(product);
  const slug = product.slug?.current;

  return {
    label: "Preview Draft",
    disabled: !path,
    title: path
      ? "Open a private draft preview (not publicly visible)"
      : "Add a slug before previewing",
    onHandle: async () => {
      try {
        const sanityToken = client.config().token;
        if (!sanityToken) {
          window.alert("Sign in to Sanity Studio to preview drafts");
          return;
        }
        const { redirectTo } = await requestProductDraftPreview({
          documentId: props.id,
          slug,
          locale: product.language,
          sanityToken,
        });
        const origin = window.location.origin;
        window.open(`${origin}${redirectTo}`, "_blank", "noopener,noreferrer");
      } catch (error) {
        window.alert(
          error instanceof Error ? error.message : "Preview failed",
        );
      } finally {
        props.onComplete();
      }
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
