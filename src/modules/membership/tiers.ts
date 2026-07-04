/**
 * Phase 9 — Membership Tiers
 *
 * Tier definitions map to permission keys. Editorial tier copy lives in Sanity;
 * permission keys and benefit envelopes are resolved here at runtime.
 */

import type { CapabilityKey } from "@/lib/permissions/capabilities";

export type MembershipTier =
  | "free_registered"
  | "student"
  | "practitioner"
  | "research"
  | "institutional"
  | "supporting_member"
  | "lifetime";

export interface TierDefinition {
  key: MembershipTier;
  label: string;
  cadence: "none" | "course_linked" | "monthly" | "annual" | "one_time";
  primaryAudience: string;
  permissionKeys: CapabilityKey[];
  isFuture?: boolean;
}

export const TIER_DEFINITIONS: Record<MembershipTier, TierDefinition> = {
  free_registered: {
    key: "free_registered",
    label: "Registered",
    cadence: "none",
    primaryAudience: "Everyone with an account",
    permissionKeys: [
      "library.read.public",
      "forum.read",
      "forum.post",
      "forum.reply",
      "forum.bookmark",
      "event.register",
      "profile.manage",
      "comms.announcements",
    ],
  },

  student: {
    key: "student",
    label: "Student",
    cadence: "course_linked",
    primaryAudience: "Enrolled learners",
    permissionKeys: [
      "library.read.public",
      "library.read.private",
      "library.download",
      "forum.read",
      "forum.read.private",
      "forum.post",
      "forum.reply",
      "forum.attach",
      "forum.bookmark",
      "campus.access",
      "campus.ai_tutor",
      "campus.flashcards",
      "campus.assignments",
      "campus.downloads",
      "event.register",
      "event.attend",
      "credential.view",
    ],
  },

  practitioner: {
    key: "practitioner",
    label: "Practitioner",
    cadence: "monthly",
    primaryAudience: "Verified practitioners",
    permissionKeys: [
      "library.read.private",
      "practitioner.portal",
      "practitioner.protocols",
      "practitioner.cpd",
      "practitioner.network",
      "forum.read.private",
      "cpd.log",
      "cpd.view",
      "cpd.statement",
      "directory.list_self",
    ],
  },

  research: {
    key: "research",
    label: "Research",
    cadence: "monthly",
    primaryAudience: "Researchers",
    permissionKeys: [
      "library.read.private",
      "research.library",
      "research.collaborate",
      "forum.read.private",
      "cpd.log",
      "cpd.view",
    ],
  },

  institutional: {
    key: "institutional",
    label: "Institutional",
    cadence: "annual",
    primaryAudience: "Organisations",
    permissionKeys: [
      "library.read.private",
      "forum.read.private",
      "event.register",
      "governance.audit",
    ],
  },

  supporting_member: {
    key: "supporting_member",
    label: "Supporting Member",
    cadence: "monthly",
    primaryAudience: "Well-wishers who fund the mission",
    permissionKeys: [
      "library.read.private",
      "comms.announcements",
      "event.register",
      "alumni.events",
    ],
  },

  lifetime: {
    key: "lifetime",
    label: "Lifetime",
    cadence: "one_time",
    primaryAudience: "Committed members",
    permissionKeys: [
      "library.read.private",
      "comms.announcements",
      "event.register",
      "alumni.events",
    ],
    isFuture: true,
  },
};

export function getTierPermissionKeys(tier: MembershipTier): CapabilityKey[] {
  return TIER_DEFINITIONS[tier]?.permissionKeys ?? [];
}

export const DEFAULT_TIER: MembershipTier = "free_registered";
