/**
 * Phase 9 — Membership Lifecycle
 *
 * Valid state transitions for membership status.
 */

import type { MembershipStatus } from "@/modules/membership/service";
import { updateMembershipStatus } from "@/modules/membership/service";

const VALID_MEMBERSHIP_TRANSITIONS: Record<
  MembershipStatus,
  MembershipStatus[]
> = {
  active: ["paused", "cancelled", "expired", "grace_period"],
  paused: ["active", "cancelled", "expired"],
  grace_period: ["active", "cancelled", "expired"],
  cancelled: ["active"],
  expired: ["active"],
};

export async function transitionMembershipStatus(
  accountId: string,
  newStatus: MembershipStatus,
  reason?: string
): Promise<void> {
  const { getMembership } = await import("@/modules/membership/service");
  const membership = await getMembership(accountId);

  if (!membership) throw new Error("Membership not found");

  const currentStatus = membership.status as MembershipStatus;
  const allowed = VALID_MEMBERSHIP_TRANSITIONS[currentStatus];

  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid membership transition: ${currentStatus} → ${newStatus}`
    );
  }

  await updateMembershipStatus(accountId, newStatus, reason);
}

/** Role conferral triggers from institutional events */
export async function onEnrolment(accountId: string): Promise<void> {
  const { assignRole } = await import("@/modules/identity/service");
  const { grantMembership } = await import("@/modules/membership/service");

  await assignRole(accountId, "student");
  await grantMembership({
    accountId,
    tierKey: "student",
    source: "enrolment",
    reason: "course_enrolment",
  });
}

export async function onGraduation(accountId: string): Promise<void> {
  const { assignRole } = await import("@/modules/identity/service");

  await assignRole(accountId, "graduate");
}

export async function onVerificationApproved(
  accountId: string,
  type: "practitioner" | "researcher" | "faculty"
): Promise<void> {
  const { assignRole } = await import("@/modules/identity/service");
  const { grantMembership } = await import("@/modules/membership/service");

  const roleMap = {
    practitioner: "practitioner" as const,
    researcher: "researcher" as const,
    faculty: "faculty" as const,
  };

  const tierMap = {
    practitioner: "practitioner" as const,
    researcher: "research" as const,
    faculty: "free_registered" as const,
  };

  await assignRole(accountId, roleMap[type]);
  await grantMembership({
    accountId,
    tierKey: tierMap[type],
    source: "grant",
    reason: `${type}_verification_approved`,
  });
}
