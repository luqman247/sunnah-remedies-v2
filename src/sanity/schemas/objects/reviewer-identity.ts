import { defineField, defineType } from "sanity";

/**
 * Reusable reviewer-identity object — captured once per scholar-review
 * session and embedded on the session document. Never a document type
 * itself (no standalone "reviewer account"), per the review portal's "no
 * account required" requirement.
 *
 * @see /scholar-review (Next.js route tree) — staging-only review portal.
 */
export const reviewerIdentity = defineType({
  name: "reviewerIdentity",
  title: "Reviewer Identity",
  type: "object",
  fields: [
    defineField({ name: "fullName", title: "Full Name", type: "string", validation: (r) => r.required().max(120) }),
    defineField({ name: "roleOrQualification", title: "Role / Qualification", type: "string", validation: (r) => r.required().max(200) }),
    defineField({ name: "organisation", title: "Organisation (optional)", type: "string", validation: (r) => r.max(200) }),
    defineField({ name: "email", title: "Email (optional)", type: "string", validation: (r) => r.max(200) }),
  ],
  preview: {
    select: { title: "fullName", subtitle: "roleOrQualification" },
  },
});
