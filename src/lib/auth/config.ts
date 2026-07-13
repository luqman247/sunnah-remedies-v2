import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Staff authentication configuration.
 *
 * Architectural decisions:
 *
 * 1. Uses the Credentials provider for maximum self-sufficiency.
 *    The institution controls staff accounts directly without depending
 *    on an external OAuth provider that may change pricing, terms, or API.
 *
 * 2. Staff credentials are stored in environment variables initially.
 *    This is appropriate for a small team (<30). When the institution
 *    scales, this can be migrated to a database-backed provider without
 *    changing the auth interface or middleware.
 *
 * 3. Roles are embedded in the session token. The middleware and pages
 *    use role information to enforce least-privilege access.
 *
 * 4. Sessions use JWT (stateless) rather than database sessions.
 *    This avoids needing a session database and is appropriate for
 *    internal tools where session invalidation on password change
 *    is handled by short token lifetimes.
 *
 * Environment variables required:
 *   NEXTAUTH_SECRET — a random 32+ character secret for JWT signing
 *   NEXTAUTH_URL — the canonical URL (e.g. https://sunnahremedies.com)
 *   STAFF_CREDENTIALS — JSON array of {email, password, name, role}
 *
 * @see Phase 4, Chapter 11.5 — Access management SOP
 * @see Phase 4, Chapter 02.9 — Same-day access revocation (remove from env)
 */

export type StaffRole =
  | "admin"
  | "clinical"
  | "apothecary"
  | "editorial"
  | "media"
  | "academy"
  | "journeys"
  | "facilities"
  | "systems";

interface StaffCredential {
  email: string;
  password: string;
  name: string;
  role: StaffRole;
}

export function getStaffCredentials(): StaffCredential[] {
  const raw = process.env.STAFF_CREDENTIALS;
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    console.error("[Auth] Failed to parse STAFF_CREDENTIALS environment variable.");
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Staff Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const staff = getStaffCredentials();
        const match = staff.find(
          (s) =>
            s.email.toLowerCase() === credentials.email.toLowerCase() &&
            s.password === credentials.password
        );

        if (!match) return null;

        return {
          id: match.email,
          email: match.email,
          name: match.name,
          role: match.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours — a working day
  },

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
