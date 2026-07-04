/**
 * Phase 9 — Capability Keys
 *
 * Authoritative capability keys for the permission resolver.
 * Permissions are checked at the service boundary — never assumed from UI state.
 */

export type CapabilityKey =
  /* Library */
  | "library.read.public"
  | "library.read.private"
  | "library.download"
  /* Forum */
  | "forum.read"
  | "forum.read.private"
  | "forum.post"
  | "forum.reply"
  | "forum.attach"
  | "forum.mark_beneficial"
  | "forum.bookmark"
  /* Course & Campus */
  | "course.enrol"
  | "course.view"
  | "campus.access"
  | "campus.ai_tutor"
  | "campus.flashcards"
  | "campus.assignments"
  | "campus.downloads"
  /* Practitioner */
  | "practitioner.portal"
  | "practitioner.protocols"
  | "practitioner.cpd"
  | "practitioner.network"
  /* Directory */
  | "directory.list_self"
  | "directory.search"
  /* CPD */
  | "cpd.log"
  | "cpd.view"
  | "cpd.statement"
  /* Mentorship */
  | "mentorship.offer"
  | "mentorship.request"
  /* Events */
  | "event.register"
  | "event.create"
  | "event.attend"
  /* Credentials */
  | "credential.view"
  | "credential.issue"
  | "credential.verify"
  /* Moderation & Governance */
  | "moderation.act"
  | "moderation.review"
  | "governance.admin"
  | "governance.audit"
  /* Communications */
  | "comms.announcements"
  | "comms.faculty_messages"
  /* Alumni */
  | "alumni.network"
  | "alumni.events"
  /* Research */
  | "research.library"
  | "research.collaborate"
  /* Profile */
  | "profile.manage"
  | "profile.view.members";

/** Capabilities that require conduct acknowledgement before first use */
export const CONDUCT_GATED_CAPABILITIES: CapabilityKey[] = [
  "forum.post",
  "forum.reply",
  "mentorship.offer",
  "mentorship.request",
];

/** Capabilities never gated by commercial tier (Integrity Ledger) */
export const INTEGRITY_UNGATED_CAPABILITIES: CapabilityKey[] = [
  "library.read.public",
  "comms.announcements",
];

export const ALL_CAPABILITIES: CapabilityKey[] = [
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
];
