/**
 * Phase 8 — Role-Based Access Control
 *
 * Least-privilege RBAC over ten staff roles.
 * Permissions are additive but bounded by the clinical partition.
 * Every gated action writes an audit record.
 */

import { db, schema } from "../../db";
import { eq, and } from "drizzle-orm";

export type StaffRole =
  | "editor" | "author" | "faculty" | "practitioner" | "researcher"
  | "operations" | "finance" | "marketing" | "administrator" | "leadership";

export type GatedAction =
  | "integrity_approval"
  | "citation_confirmation"
  | "refund_approval"
  | "purchase_order_approval"
  | "public_post_approval"
  | "media_approval"
  | "clinical_record_access"
  | "publish_content"
  | "schedule_content"
  | "manage_courses"
  | "manage_bookings"
  | "manage_inventory"
  | "manage_finance"
  | "manage_users"
  | "view_dashboard"
  | "view_clinical_aggregate";

const ROLE_PERMISSIONS: Record<StaffRole, GatedAction[]> = {
  author: ["schedule_content"],
  editor: ["publish_content", "schedule_content", "media_approval", "view_dashboard"],
  faculty: ["manage_courses", "manage_bookings", "view_dashboard"],
  practitioner: ["clinical_record_access", "manage_bookings", "view_dashboard"],
  researcher: ["view_dashboard"],
  operations: ["manage_inventory", "manage_bookings", "view_dashboard"],
  finance: ["manage_finance", "refund_approval", "purchase_order_approval", "view_dashboard"],
  marketing: ["public_post_approval", "view_dashboard"],
  administrator: ["manage_users", "view_dashboard", "manage_inventory", "manage_bookings"],
  leadership: [
    "integrity_approval", "citation_confirmation", "refund_approval",
    "purchase_order_approval", "public_post_approval", "media_approval",
    "view_dashboard", "view_clinical_aggregate",
  ],
};

export function getPermissionsForRoles(roles: StaffRole[]): GatedAction[] {
  const perms = new Set<GatedAction>();
  for (const role of roles) {
    const rolePerms = ROLE_PERMISSIONS[role];
    if (rolePerms) {
      for (const p of rolePerms) perms.add(p);
    }
  }
  return Array.from(perms);
}

export function hasPermission(roles: StaffRole[], action: GatedAction): boolean {
  return getPermissionsForRoles(roles).includes(action);
}

export async function getStaffUser(email: string) {
  const users = await db
    .select()
    .from(schema.staffUsers)
    .where(eq(schema.staffUsers.email, email))
    .limit(1);
  return users[0] ?? null;
}

export async function checkStaffPermission(
  staffUserId: string,
  action: GatedAction
): Promise<boolean> {
  const users = await db
    .select()
    .from(schema.staffUsers)
    .where(
      and(
        eq(schema.staffUsers.id, staffUserId),
        eq(schema.staffUsers.isActive, true)
      )
    )
    .limit(1);

  if (!users[0]) return false;

  const roles = (users[0].roles ?? []) as StaffRole[];
  return hasPermission(roles, action);
}

/* ── Clinical Partition Guard ───────────────────────────────────── */

export function canAccessClinicalData(roles: StaffRole[], context: {
  ownPatientsOnly?: boolean;
  practitionerId?: string;
  requestingPractitionerId?: string;
}): boolean {
  if (!roles.includes("practitioner") && !roles.includes("leadership")) {
    return false;
  }

  if (roles.includes("practitioner") && context.ownPatientsOnly !== false) {
    return context.practitionerId === context.requestingPractitionerId;
  }

  if (roles.includes("leadership")) {
    return true;
  }

  return false;
}
