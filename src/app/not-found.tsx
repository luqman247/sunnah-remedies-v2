import Link from "next/link";

export default function NotFound() {
  return (
    <div className="leaf" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
      <div className="measure-wide" style={{ textAlign: "center", maxWidth: "var(--measure-reading)", margin: "0 auto" }}>
        <p className="type-eyebrow" style={{ marginBottom: "var(--s4)" }}>
          THE CORRIDOR DOES NOT CONTINUE HERE
        </p>
        <h1 className="type-display-l" style={{ marginBottom: "var(--s4)" }}>
          This page has not been found
        </h1>
        <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s6)" }}>
          You may have followed a link that has moved, or the page you seek has not yet been published. The institution has not abandoned you — here are the ways forward
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s5)", justifyContent: "center" }}>
          <Link href="/" className="quiet-link">
            Return to the threshold
          </Link>
          <Link href="/knowledge-library" className="quiet-link">
            The Knowledge Library
          </Link>
          <Link href="/the-apothecary" className="quiet-link">
            The Apothecary
          </Link>
          <Link href="/the-academy" className="quiet-link">
            The Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
