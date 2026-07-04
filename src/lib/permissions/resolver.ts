/**
 * Phase 9 — Permission Resolver
 *
 * Effective permissions = union(role capabilities) ∪ (tier permission keys)
 * ∪ (verification grants) ∪ (explicit admin grants) − (active suspensions).
 *
 * Resolved server-side on every request; cached per session.
 */

import type { CapabilityKey } from "@/lib/permissions/capabilities";
import {
  CONDUCT_GATED_CAPABILITIES,
  INTEGRITY_UNGATED_CAPABILITIES,
} from "@/lib/permissions/capabilities";
import {
  ROLE_CAPABILITIES,
  type InstitutionalRole,
  type MemberRole,
} from "@/modules/identity/roles";
import {
  getTierPermissionKeys,
  type MembershipTier,
} from "@/modules/membership/tiers";

export interface PermissionContext {
  roles: MemberRole[];
  tierKey: MembershipTier;
  adminGrants?: CapabilityKey[];
  verificationGrants?: CapabilityKey[];
  suspendedCapabilities?: CapabilityKey[];
  conductAcknowledged?: boolean;
}

export interface ResolvedPermissions {
  capabilities: Set<CapabilityKey>;
  roles: MemberRole[];
  tierKey: MembershipTier;
  isSuspended: boolean;
}

function unionCapabilities(
  ...sources: CapabilityKey[][]
): Set<CapabilityKey> {
  const result = new Set<CapabilityKey>();
  for (const source of sources) {
    for (const cap of source) {
      result.add(cap);
    }
  }
  return result;
}

export function resolvePermissions(
  context: PermissionContext
): ResolvedPermissions {
  const roleCaps: CapabilityKey[] = [];

  for (const role of context.roles) {
    const caps = ROLE_CAPABILITIES[role as InstitutionalRole];
    if (caps) roleCaps.push(...caps);
  }

  const tierCaps = getTierPermissionKeys(context.tierKey);
  const verificationCaps = context.verificationGrants ?? [];
  const adminCaps = context.adminGrants ?? [];

  let capabilities = unionCapabilities(
    roleCaps,
    tierCaps,
    verificationCaps,
    adminCaps
  );

  // Integrity Ledger: safety-critical capabilities always present
  for (const cap of INTEGRITY_UNGATED_CAPABILITIES) {
    capabilities.add(cap);
  }

  const isSuspended = (context.suspendedCapabilities?.length ?? 0) > 0;

  // Subtract suspended capabilities
  if (context.suspendedCapabilities) {
    for (const cap of context.suspendedCapabilities) {
      if (!INTEGRITY_UNGATED_CAPABILITIES.includes(cap)) {
        capabilities.delete(cap);
      }
    }
  }

  // Conduct gate: forum posting requires acknowledgement
  if (!context.conductAcknowledged) {
    for (const cap of CONDUCT_GATED_CAPABILITIES) {
      capabilities.delete(cap);
    }
  }

  return {
    capabilities,
    roles: context.roles,
    tierKey: context.tierKey,
    isSuspended,
  };
}

export function hasCapability(
  resolved: ResolvedPermissions,
  capability: CapabilityKey
): boolean {
  if (INTEGRITY_UNGATED_CAPABILITIES.includes(capability)) {
    return true;
  }
  return resolved.capabilities.has(capability);
}

export function hasAnyCapability(
  resolved: ResolvedPermissions,
  capabilities: CapabilityKey[]
): boolean {
  return capabilities.some((c) => hasCapability(resolved, c));
}

export function hasAllCapabilities(
  resolved: ResolvedPermissions,
  capabilities: CapabilityKey[]
): boolean {
  return capabilities.every((c) => hasCapability(resolved, c));
}

export function capabilitiesToArray(
  resolved: ResolvedPermissions
): CapabilityKey[] {
  return Array.from(resolved.capabilities).sort();
}
