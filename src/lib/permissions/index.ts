/**
 * Phase 9 — Permission Guards
 *
 * Server-side boundary checks. Deny by default.
 */

import type { CapabilityKey } from "@/lib/permissions/capabilities";
import {
  resolvePermissions,
  hasCapability,
  type ResolvedPermissions,
  type PermissionContext,
} from "@/lib/permissions/resolver";

export class PermissionDeniedError extends Error {
  constructor(
    public readonly capability: CapabilityKey,
    message?: string
  ) {
    super(message ?? `Permission denied: ${capability}`);
    this.name = "PermissionDeniedError";
  }
}

export function requireCapability(
  resolved: ResolvedPermissions,
  capability: CapabilityKey
): void {
  if (!hasCapability(resolved, capability)) {
    throw new PermissionDeniedError(capability);
  }
}

export function checkCapability(
  context: PermissionContext,
  capability: CapabilityKey
): boolean {
  const resolved = resolvePermissions(context);
  return hasCapability(resolved, capability);
}

export { resolvePermissions, hasCapability };
export type { ResolvedPermissions, PermissionContext };
