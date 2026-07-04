/**
 * Phase 9 — Member Session Helpers
 *
 * Resolves member identity and permissions from JWT session or account ID.
 */

import { getServerSession } from "next-auth";
import { memberAuthOptions } from "@/lib/auth/member-config";
import {
  resolveAccountPermissions,
} from "@/modules/membership/service";
import type { ResolvedPermissions } from "@/lib/permissions/resolver";
import { getAccountById } from "@/modules/identity/service";
import type { CapabilityKey } from "@/lib/permissions/capabilities";
import { hasCapability } from "@/lib/permissions/resolver";

export interface MemberSession {
  accountId: string;
  email: string;
  displayName: string;
  roles: string[];
  tierKey: string;
  capabilities: CapabilityKey[];
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const session = await getServerSession(memberAuthOptions);
  if (!session?.user?.accountId) return null;

  return {
    accountId: session.user.accountId,
    email: session.user.email ?? "",
    displayName: session.user.name ?? "",
    roles: session.user.roles ?? [],
    tierKey: session.user.tierKey ?? "free_registered",
    capabilities: (session.user.capabilities ?? []) as CapabilityKey[],
  };
}

export async function requireMemberSession(): Promise<MemberSession> {
  const session = await getMemberSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}

export async function refreshMemberPermissions(
  accountId: string
): Promise<ResolvedPermissions> {
  return resolveAccountPermissions(accountId);
}

export async function memberHasCapability(
  accountId: string,
  capability: CapabilityKey
): Promise<boolean> {
  const resolved = await resolveAccountPermissions(accountId);
  return hasCapability(resolved, capability);
}

export async function loadMemberContext(accountId: string) {
  const [account, permissions] = await Promise.all([
    getAccountById(accountId),
    resolveAccountPermissions(accountId),
  ]);

  if (!account) return null;

  return { account, permissions };
}
