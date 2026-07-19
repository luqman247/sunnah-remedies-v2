import { defineField, defineType } from "sanity";

/**
 * One scholar-review session — created once when a reviewer first enters
 * their identity, then referenced by every entry/collection/feeling review
 * record they create across both review programmes. The session id is
 * carried in the reviewer's session cookie (never the identity fields
 * themselves) so they can leave and return without re-entering their name.
 *
 * STAGING-ONLY document type. The application's write layer
 * (src/lib/scholar-review/staging-client.ts) refuses to create or read
 * this type against any dataset other than "staging" — see that module's
 * runtime guard for the actual enforcement; this schema file only defines
 * the shape.
 *
 * @see /scholar-review
 */
export const scholarlyReviewSession = defineType({
  name: "scholarlyReviewSession",
  title: "Scholarly Review Session",
  type: "document",
  fields: [
    defineField({ name: "reviewer", title: "Reviewer", type: "reviewerIdentity", validation: (r) => r.required() }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "lastActiveAt", title: "Last Active At", type: "datetime" }),
    defineField({
      name: "duaDhikrProgrammeSubmittedAt",
      title: "Duʿā & Dhikr Programme Submitted At",
      type: "datetime",
      description: "Set once the reviewer submits their Duʿā & Dhikr review as complete. Absence means still in progress.",
    }),
    defineField({
      name: "feelingProgrammeSubmittedAt",
      title: "\"I am feeling…\" Programme Submitted At",
      type: "datetime",
      description: "Set once the reviewer submits their I am feeling review as complete. Absence means still in progress.",
    }),
  ],
  preview: {
    select: { title: "reviewer.fullName", subtitle: "reviewer.roleOrQualification", createdAt: "createdAt" },
    prepare({ title, subtitle, createdAt }) {
      return { title, subtitle: `${subtitle ?? ""} · ${createdAt ? new Date(createdAt).toLocaleDateString() : ""}` };
    },
  },
});
