import { withAuth } from "next-auth/middleware";

/**
 * Route protection middleware.
 *
 * Protects all routes under the (staff) route group — /handbook and /ops.
 * Unauthenticated requests are redirected to the sign-in page.
 *
 * Architectural decisions:
 * - Only staff routes are protected; the public site remains fully accessible.
 * - The /studio route is NOT protected here (Sanity has its own auth layer).
 * - The sign-in page itself is excluded from protection.
 * - Uses next-auth's built-in middleware helper for JWT verification.
 *
 * @see Phase 4, Chapter 11.5 — Access management: least-privilege
 */
export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
});

export const config = {
  matcher: ["/handbook/:path*", "/ops/:path*"],
};
