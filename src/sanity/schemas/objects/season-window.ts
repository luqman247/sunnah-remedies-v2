/**
 * Season window — editorial time-bounding for seasonal collections.
 *
 * Used for genuine seasonal curation, never to fabricate scarcity or urgency.
 *
 * @see Phase 4 Part 2, Spec 09 §9.12
 */

import { defineField, defineType } from "sanity";

export const seasonWindow = defineType({
  name: "seasonWindow",
  title: "Season Window",
  type: "object",
  fields: [
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    defineField({
      name: "isSeasonal",
      title: "Is Seasonal",
      type: "boolean",
      description: "Flags a time-bound collection.",
      initialValue: false,
    }),
  ],
});
