/**
 * Phase 9 — Member Roles
 *
 * Capability-bearing institutional roles. A person may hold multiple roles.
 */

import type { CapabilityKey } from "@/lib/permissions/capabilities";

export type MemberRole =
  | "registered_user"
  | "student"
  | "graduate"
  | "practitioner"
  | "researcher"
  | "faculty"
  | "moderator"
  | "institution_member"
  | "partner"
  | "admin"
  | "donor"
  | "volunteer"
  | "ambassador";

/** Visitor is the implicit unauthenticated state — not stored in DB */
export type InstitutionalRole = MemberRole | "visitor";

export const MEMBER_ROLES: MemberRole[] = [
  "registered_user",
  "student",
  "graduate",
  "practitioner",
  "researcher",
  "faculty",
  "moderator",
  "institution_member",
  "partner",
  "admin",
  "donor",
  "volunteer",
  "ambassador",
];

export const FUTURE_ROLES: MemberRole[] = ["donor", "volunteer", "ambassador"];

export interface RoleDefinition {
  key: MemberRole;
  label: string;
  description: string;
  acquiredBy: string;
  isFuture?: boolean;
}

export const ROLE_DEFINITIONS: Record<MemberRole, RoleDefinition> = {
  registered_user: {
    key: "registered_user",
    label: "Registered User",
    description: "Has an account with verified email",
    acquiredBy: "Sign-up and email verification",
  },
  student: {
    key: "student",
    label: "Student",
    description: "Enrolled on at least one active course",
    acquiredBy: "Course enrolment",
  },
  graduate: {
    key: "graduate",
    label: "Graduate / Alumnus",
    description: "Completed at least one programme",
    acquiredBy: "Programme completion (auto-conferred)",
  },
  practitioner: {
    key: "practitioner",
    label: "Practitioner",
    description: "Verified clinical practitioner",
    acquiredBy: "Verification workflow",
  },
  researcher: {
    key: "researcher",
    label: "Researcher",
    description: "Verified research contributor",
    acquiredBy: "Faculty grant or application",
  },
  faculty: {
    key: "faculty",
    label: "Faculty",
    description: "Teaches, verifies clinical content, answers Q&A",
    acquiredBy: "Institutional appointment",
  },
  moderator: {
    key: "moderator",
    label: "Moderator",
    description: "Enforces conduct within assigned forums",
    acquiredBy: "Institutional appointment",
  },
  institution_member: {
    key: "institution_member",
    label: "Institution Member",
    description: "Formal member with tiered access",
    acquiredBy: "Membership subscription or grant",
  },
  partner: {
    key: "partner",
    label: "Partner",
    description: "Organisational relationship",
    acquiredBy: "Institutional agreement",
  },
  admin: {
    key: "admin",
    label: "Administrator",
    description: "Full governance access",
    acquiredBy: "Institutional appointment",
  },
  donor: {
    key: "donor",
    label: "Donor",
    description: "Reserved for future donor programme",
    acquiredBy: "Reserved",
    isFuture: true,
  },
  volunteer: {
    key: "volunteer",
    label: "Volunteer",
    description: "Reserved for future volunteer programme",
    acquiredBy: "Reserved",
    isFuture: true,
  },
  ambassador: {
    key: "ambassador",
    label: "Ambassador",
    description: "Reserved for future ambassador programme",
    acquiredBy: "Reserved",
    isFuture: true,
  },
};

/**
 * Base capabilities granted by each role (before tier entitlements).
 * Tier keys and admin grants are unioned separately by the resolver.
 */
export const ROLE_CAPABILITIES: Record<InstitutionalRole, CapabilityKey[]> = {
  visitor: ["library.read.public"],

  registered_user: [
    "library.read.public",
    "forum.read",
    "forum.post",
    "forum.reply",
    "forum.bookmark",
    "course.enrol",
    "course.view",
    "event.register",
    "profile.manage",
    "profile.view.members",
    "comms.announcements",
  ],

  student: [
    "library.read.public",
    "library.read.private",
    "library.download",
    "forum.read",
    "forum.read.private",
    "forum.post",
    "forum.reply",
    "forum.attach",
    "forum.bookmark",
    "course.enrol",
    "course.view",
    "campus.access",
    "campus.ai_tutor",
    "campus.flashcards",
    "campus.assignments",
    "campus.downloads",
    "event.register",
    "event.attend",
    "credential.view",
    "profile.manage",
    "profile.view.members",
    "comms.announcements",
  ],

  graduate: [
    "library.read.public",
    "library.read.private",
    "library.download",
    "forum.read",
    "forum.read.private",
    "forum.post",
    "forum.reply",
    "forum.attach",
    "forum.bookmark",
    "course.enrol",
    "course.view",
    "event.register",
    "event.attend",
    "credential.view",
    "cpd.log",
    "cpd.view",
    "cpd.statement",
    "mentorship.offer",
    "alumni.network",
    "alumni.events",
    "profile.manage",
    "profile.view.members",
    "comms.announcements",
  ],

  practitioner: [
    "library.read.public",
    "library.read.private",
    "library.download",
    "forum.read",
    "forum.read.private",
    "forum.post",
    "forum.reply",
    "forum.attach",
    "forum.bookmark",
    "course.enrol",
    "course.view",
    "practitioner.portal",
    "practitioner.protocols",
    "practitioner.cpd",
    "practitioner.network",
    "directory.list_self",
    "cpd.log",
    "cpd.view",
    "cpd.statement",
    "event.register",
    "event.attend",
    "credential.view",
    "profile.manage",
    "profile.view.members",
    "comms.announcements",
  ],

  researcher: [
    "library.read.public",
    "library.read.private",
    "library.download",
    "forum.read",
    "forum.read.private",
    "forum.post",
    "forum.reply",
    "forum.attach",
    "forum.bookmark",
    "course.enrol",
    "course.view",
    "research.library",
    "research.collaborate",
    "cpd.log",
    "cpd.view",
    "event.register",
    "event.attend",
    "credential.view",
    "profile.manage",
    "profile.view.members",
    "comms.announcements",
  ],

  faculty: [
    "library.read.public",
    "library.read.private",
    "library.download",
    "forum.read",
    "forum.read.private",
    "forum.post",
    "forum.reply",
    "forum.attach",
    "forum.mark_beneficial",
    "forum.bookmark",
    "course.enrol",
    "course.view",
    "campus.access",
    "practitioner.portal",
    "directory.list_self",
    "cpd.log",
    "cpd.view",
    "cpd.statement",
    "mentorship.offer",
    "event.register",
    "event.create",
    "event.attend",
    "credential.view",
    "credential.issue",
    "moderation.review",
    "comms.announcements",
    "comms.faculty_messages",
    "profile.manage",
    "profile.view.members",
  ],

  moderator: [
    "library.read.public",
    "library.read.private",
    "forum.read",
    "forum.read.private",
    "forum.post",
    "forum.reply",
    "forum.attach",
    "forum.mark_beneficial",
    "forum.bookmark",
    "moderation.act",
    "moderation.review",
    "profile.manage",
    "profile.view.members",
    "comms.announcements",
  ],

  institution_member: [
    "library.read.public",
    "library.read.private",
    "forum.read",
    "forum.post",
    "forum.reply",
    "forum.bookmark",
    "event.register",
    "profile.manage",
    "profile.view.members",
    "comms.announcements",
  ],

  partner: [
    "library.read.public",
    "library.read.private",
    "forum.read",
    "forum.post",
    "forum.reply",
    "event.register",
    "profile.manage",
    "comms.announcements",
  ],

  admin: [
    "library.read.public",
    "library.read.private",
    "library.download",
    "forum.read",
    "forum.read.private",
    "forum.post",
    "forum.reply",
    "forum.attach",
    "forum.mark_beneficial",
    "forum.bookmark",
    "course.enrol",
    "course.view",
    "campus.access",
    "campus.ai_tutor",
    "campus.flashcards",
    "campus.assignments",
    "campus.downloads",
    "practitioner.portal",
    "practitioner.protocols",
    "practitioner.cpd",
    "practitioner.network",
    "directory.list_self",
    "directory.search",
    "cpd.log",
    "cpd.view",
    "cpd.statement",
    "mentorship.offer",
    "mentorship.request",
    "event.register",
    "event.create",
    "event.attend",
    "credential.view",
    "credential.issue",
    "credential.verify",
    "moderation.act",
    "moderation.review",
    "governance.admin",
    "governance.audit",
    "comms.announcements",
    "comms.faculty_messages",
    "alumni.network",
    "alumni.events",
    "research.library",
    "research.collaborate",
    "profile.manage",
    "profile.view.members",
  ],

  donor: ["library.read.public", "forum.read", "profile.manage"],
  volunteer: ["library.read.public", "forum.read", "profile.manage"],
  ambassador: ["library.read.public", "forum.read", "profile.manage"],
};
