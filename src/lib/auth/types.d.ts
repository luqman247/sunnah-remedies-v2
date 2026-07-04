/**
 * Auth type extensions for next-auth.
 *
 * Extends the default session and JWT types to include staff role
 * and member account fields for role-based access control.
 */
import "next-auth";
import type { CapabilityKey } from "@/lib/permissions/capabilities";

declare module "next-auth" {
  interface User {
    role?: string;
    accountId?: string;
    accountType?: "staff" | "member";
    roles?: string[];
    tierKey?: string;
    capabilities?: CapabilityKey[];
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      accountId?: string;
      accountType?: "staff" | "member";
      roles?: string[];
      tierKey?: string;
      capabilities?: CapabilityKey[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accountId?: string;
    accountType?: "staff" | "member";
    roles?: string[];
    tierKey?: string;
    capabilities?: CapabilityKey[];
  }
}
