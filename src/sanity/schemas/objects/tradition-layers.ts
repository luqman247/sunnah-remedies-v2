/**
 * Tradition layers — the four-layer honesty structure.
 *
 * Encodes the institution's non-negotiable scholarly standard directly
 * in the schema. Each layer is rendered visibly distinguished.
 *
 * @see Phase 4 Part 2, Spec 09 §9.7
 */

import { defineField, defineType } from "sanity";

export const traditionLayers = defineType({
  name: "traditionLayers",
  title: "Tradition Layers",
  type: "object",
  description: "The four-layer honesty framework — never blurred into one another.",
  fields: [
    defineField({
      name: "established",
      title: "Established (Qur'an & Authentic Sunnah)",
      type: "array",
      of: [{ type: "block" }],
      description: "What the Qur'an and authentic Sunnah establish.",
    }),
    defineField({
      name: "interpreted",
      title: "Interpreted (Scholarly Interpretation)",
      type: "array",
      of: [{ type: "block" }],
      description: "The scholarly interpretation of established sources.",
    }),
    defineField({
      name: "traditional",
      title: "Traditional (Inherited Practice)",
      type: "array",
      of: [{ type: "block" }],
      description: "Inherited or traditional practice — not directly from primary texts.",
    }),
    defineField({
      name: "ours",
      title: "Ours (Modern Preparation / View)",
      type: "array",
      of: [{ type: "block" }],
      description: "Our own modern preparation, formulation, or institutional view.",
    }),
  ],
});
