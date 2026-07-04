/**
 * Phase 9 — Portal Access Guard
 *
 * Server-side permission checks for authenticated portal routes.
 * Deny by default; redirects to sign-in or access-denied.
 */

import { getMemberSession, memberHasCapability } from "@/lib/auth/member-session";
import { isFeatureEnabled, FLAGS } from "@/operations/engine/feature-flags";
import type { CapabilityKey } from "@/lib/permissions/capabilities";
import { redirect } from "next/navigation";

export async function requirePortalAccess(
  capability: CapabilityKey = "practitioner.portal",
  callbackPath = "/portal/practitioner"
) {
  if (!(await isFeatureEnabled(FLAGS.COMMUNITY_PORTALS))) {
    redirect("/");
  }

  const session = await getMemberSession();
  if (!session) {
    redirect(
      `/membership/sign-in?callbackUrl=${encodeURIComponent(callbackPath)}`
    );
  }

  const allowed = await memberHasCapability(session.accountId, capability);
  if (!allowed) {
    redirect("/membership/access-denied");
  }

  return session;
}

export async function requirePractitionerPortal(callbackPath?: string) {
  return requirePortalAccess("practitioner.portal", callbackPath);
}

export async function requireStudentPortal(callbackPath?: string) {
  return requirePortalAccess("campus.access", callbackPath ?? "/portal/student");
}
