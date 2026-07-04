/**
 * MedicalWebPage JSON-LD builder.
 *
 * For ingredient/condition/clinical entities.
 * Carries medical integrity guardrails per §4.4.
 */

import { seoConfig } from "../config";
import { type JsonLdNode, orgRef, imageObject, personNode } from "./index";

export interface MedicalPageSchemaInput {
  name: string;
  slug: string;
  type: "ingredient" | "condition" | "bodySystem";
  description: string;
  image?: string;
  imageAlt?: string;
  reviewedBy?: { name: string; slug?: string; jobTitle?: string };
  lastReviewed?: string;
  medicalAudience?: string;
  about?: JsonLdNode;
}

export function medicalPageSchema(input: MedicalPageSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/knowledge/${input.type}/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "MedicalWebPage",
    "@id": `${url}#webpage`,
    name: input.name,
    description: input.description,
    url,
    mainEntityOfPage: { "@id": url },
    publisher: orgRef(),
    isPartOf: { "@id": `${seoConfig.siteUrl}/#website` },
  };

  if (input.image) node.image = imageObject(input.image, input.imageAlt);
  if (input.medicalAudience) node.medicalAudience = input.medicalAudience;

  // Medical integrity: only assert reviewedBy/lastReviewed from the editorial record
  if (input.reviewedBy && input.lastReviewed) {
    const reviewerUrl = input.reviewedBy.slug
      ? `${seoConfig.siteUrl}/faculty/${input.reviewedBy.slug}`
      : undefined;
    node.reviewedBy = personNode(
      input.reviewedBy.name,
      reviewerUrl,
      input.reviewedBy.jobTitle
    );
    node.lastReviewed = input.lastReviewed;
  }

  if (input.about) node.about = input.about;

  return node;
}

/* ── Medical Entity sub-builders ────────────────────────────────── */

export interface IngredientEntityInput {
  name: string;
  slug: string;
  activeIngredient?: string;
  relatedConditions?: { name: string; slug: string }[];
}

export function medicalEntityNode(input: IngredientEntityInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/knowledge/ingredient/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "Substance",
    "@id": `${url}#entity`,
    name: input.name,
    url,
  };

  if (input.activeIngredient) node.activeIngredient = input.activeIngredient;

  return node;
}

export interface ConditionEntityInput {
  name: string;
  slug: string;
  bodySystem?: string;
  symptoms?: string[];
  possibleTreatments?: { name: string; slug: string }[];
}

export function conditionNode(input: ConditionEntityInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/knowledge/condition/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "MedicalCondition",
    "@id": `${url}#entity`,
    name: input.name,
    url,
  };

  if (input.bodySystem) {
    node.associatedAnatomy = {
      "@type": "AnatomicalStructure",
      name: input.bodySystem,
    };
  }

  if (input.symptoms && input.symptoms.length > 0) {
    node.signOrSymptom = input.symptoms.map((s) => ({
      "@type": "MedicalSignOrSymptom",
      name: s,
    }));
  }

  if (input.possibleTreatments && input.possibleTreatments.length > 0) {
    node.possibleTreatment = input.possibleTreatments.map((t) => ({
      "@type": "Substance",
      name: t.name,
      url: `${seoConfig.siteUrl}/knowledge/ingredient/${t.slug}`,
    }));
  }

  return node;
}
