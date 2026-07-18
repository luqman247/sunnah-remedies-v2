import Link from "next/link";

/**
 * Root fallback when no locale segment is associated with the request.
 * Visitor-facing localised 404s render via `app/[locale]/not-found.tsx`
 * after the locale catch-all invokes `notFound()`.
 */
export default function RootNotFound() {
  return (
    <div className="leaf" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
      <div className="measure-wide" style={{ textAlign: "center", maxWidth: "var(--measure-reading)", margin: "0 auto" }}>
        <h1 className="type-display-l" style={{ marginBottom: "var(--s4)" }}>
          Not found
        </h1>
        <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s6)" }}>
          This page has not been found
        </p>
        <Link href="/" className="quiet-link">
          Return home
        </Link>
      </div>
    </div>
  );
}
