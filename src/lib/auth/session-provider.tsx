"use client";

import { SessionProvider } from "next-auth/react";

/**
 * NextAuth session provider for staff routes.
 * Wraps child components to enable useSession() hook access.
 */
export function StaffSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
