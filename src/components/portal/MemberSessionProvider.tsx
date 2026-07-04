"use client";

import { SessionProvider } from "next-auth/react";

export function MemberSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider basePath="/api/auth/member">
      {children}
    </SessionProvider>
  );
}
