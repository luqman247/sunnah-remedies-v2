/**
 * Phase 9 — Member Authentication (NextAuth)
 *
 * Separate auth configuration for institutional members.
 * Staff auth remains in @/lib/auth/config — this serves the community.
 *
 * Session strategy: JWT with cached permissions, recomputed on role/tier change.
 */

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { CapabilityKey } from "@/lib/permissions/capabilities";
import {
  authenticateAccount,
  getAccountById,
} from "@/modules/identity/service";
import {
  resolveAccountPermissions,
  getAccountCapabilities,
} from "@/modules/membership/service";

export const memberAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "member-credentials",
      name: "Member Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const account = await authenticateAccount(
          credentials.email,
          credentials.password
        );

        if (!account) return null;

        const capabilities = await getAccountCapabilities(account.account.id);
        const roles = account.roles.map((r) => r.role);

        return {
          id: account.account.id,
          email: account.account.email,
          name: account.account.displayName,
          accountId: account.account.id,
          roles,
          tierKey: account.membership?.tierKey ?? "free_registered",
          capabilities,
          accountType: "member" as const,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/membership/sign-in",
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.accountId = (user as { accountId?: string }).accountId;
        token.accountType = "member";
        token.roles = (user as { roles?: string[] }).roles;
        token.tierKey = (user as { tierKey?: string }).tierKey;
        token.capabilities = (user as { capabilities?: CapabilityKey[] }).capabilities;
      }

      // Recompute permissions on explicit session update
      if (trigger === "update" && token.accountId) {
        const capabilities = await getAccountCapabilities(
          token.accountId as string
        );
        token.capabilities = capabilities;

        const account = await getAccountById(token.accountId as string);
        if (account) {
          token.roles = account.roles.map((r) => r.role);
          token.tierKey = account.membership?.tierKey ?? "free_registered";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.accountId = token.accountId as string;
        session.user.accountType = "member";
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.tierKey = (token.tierKey as string) ?? "free_registered";
        session.user.capabilities =
          (token.capabilities as CapabilityKey[]) ?? [];
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export async function recomputeMemberSessionPermissions(
  accountId: string
): Promise<{ roles: string[]; tierKey: string; capabilities: string[] }> {
  const [account, resolved] = await Promise.all([
    getAccountById(accountId),
    resolveAccountPermissions(accountId),
  ]);

  return {
    roles: account?.roles.map((r) => r.role) ?? [],
    tierKey: account?.membership?.tierKey ?? "free_registered",
    capabilities: Array.from(resolved.capabilities),
  };
}
