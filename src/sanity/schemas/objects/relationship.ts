import { defineField, defineType } from "sanity";

/**
 * Typed relationship object — a directed, typed edge with optional qualifiers.
 *
 * Relationships are declared once on the natural owner and resolved
 * bidirectionally at projection time.
 */
export const relationship = defineType({
  name: "relationship",
  title: "Relationship",
  type: "object",
  fields: [
    defineField({
      name: "target",
      title: "Target Entity",
      type: "reference",
      to: [
        { type: "ingredient" },
        { type: "condition" },
        { type: "bodySystem" },
        { type: "product" },
        { type: "article" },
        { type: "programme" },
        { type: "journey" },
        { type: "hadith" },
        { type: "quranReferenceDoc" },
        { type: "researchPaper" },
        { type: "scholar" },
        { type: "faculty" },
        { type: "citation" },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relationType",
      title: "Relationship Type",
      type: "string",
      options: {
        list: [
          { title: "Treats", value: "treats" },
          { title: "Treated By", value: "treatedBy" },
          { title: "Contains Ingredient", value: "containsIngredient" },
          { title: "Evidenced By", value: "evidencedBy" },
          { title: "Cited In", value: "citedIn" },
          { title: "Contraindicated In", value: "contraindicatedIn" },
          { title: "Part of Body System", value: "partOfBodySystem" },
          { title: "Taught In", value: "taughtIn" },
          { title: "Related To", value: "relatedTo" },
          { title: "Prepared By", value: "preparedBy" },
          { title: "Authored By", value: "authoredBy" },
          { title: "Reviewed By", value: "reviewedBy" },
          { title: "Referenced In", value: "referencedIn" },
          { title: "Synonym Of", value: "synonymOf" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "strength",
      title: "Strength",
      type: "number",
      description: "Weighting for ranking related-* modules (1-10, higher = stronger)",
      validation: (rule) => rule.min(1).max(10),
      initialValue: 5,
    }),
    defineField({
      name: "note",
      title: "Editorial Note",
      type: "string",
      description: "Brief note on this relationship for editors.",
    }),
    defineField({
      name: "evidenceLevel",
      title: "Evidence Level",
      type: "string",
      description: "Where the edge is a clinical claim, the evidence tier.",
      options: {
        list: [
          { title: "Strong (RCT/meta-analysis)", value: "strong" },
          { title: "Moderate (cohort/observational)", value: "moderate" },
          { title: "Limited (case study/traditional)", value: "limited" },
          { title: "Traditional use only", value: "traditional" },
          { title: "Prophetic tradition", value: "prophetic" },
        ],
      },
      hidden: ({ parent }) => {
        const clinicalTypes = ["treats", "treatedBy", "evidencedBy", "contraindicatedIn"];
        return !clinicalTypes.includes(parent?.relationType);
      },
    }),
  ],
  preview: {
    select: {
      targetTitle: "target.title",
      targetName: "target.name",
      relationType: "relationType",
    },
    prepare({ targetTitle, targetName, relationType }) {
      return {
        title: targetTitle || targetName || "Untitled",
        subtitle: relationType,
      };
    },
  },
});
