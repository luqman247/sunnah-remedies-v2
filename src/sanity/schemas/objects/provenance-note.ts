/**
 * Provenance note — editorial provenance narrative.
 *
 * Distinct from Shopify country-of-origin (a commerce/customs fact).
 * This is the editorial *story* of where something comes from.
 *
 * @see Phase 4 Part 2, Spec 09 §9.13
 */

import { defineField, defineType } from "sanity";

export const provenanceNote = defineType({
  name: "provenanceNote",
  title: "Provenance Note",
  type: "object",
  fields: [
    defineField({
      name: "originNarrative",
      title: "Origin Narrative",
      type: "array",
      of: [{ type: "block" }],
      description: "The editorial story of provenance.",
    }),
    defineField({
      name: "note",
      title: "Internal Note",
      type: "text",
      rows: 3,
      description: "Internal sourcing note — not displayed publicly.",
    }),
  ],
});
