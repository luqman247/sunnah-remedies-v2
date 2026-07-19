import Link from "next/link";
import { logoutAction } from "@/app/scholar-review/actions";

/**
 * Shared shell for every gated /scholar-review page: the mandatory
 * "provisional, not published" banner, navigation between the two review
 * programmes and the owner summary, reviewer name, and logout. Deliberately
 * plain HTML `<a>`/`<Link>` navigation — this is a professional working
 * interface, not the public site, and does not reuse public-site chrome
 * components (SectionPage/Masthead) which carry public branding/locale
 * assumptions that don't apply here.
 */
export function ReviewChrome({ reviewerName, children }: { reviewerName: string; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F6F3EE", color: "#20211C", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#0E3B2E", color: "#F6F3EE", padding: "0.5rem 1rem", textAlign: "center", fontSize: "0.85rem" }}>
        <strong>Private scholarly review — provisional content, not published</strong>
        <span style={{ opacity: 0.7 }}> · Privat faglig gennemgang — foreløbigt indhold, ikke offentliggjort</span>
      </div>
      <header style={{ borderBottom: "1px solid #E2DCCF", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0.85rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <nav style={{ display: "flex", gap: "1.25rem", fontSize: "0.9rem" }}>
            <Link href="/scholar-review" style={navLinkStyle}>
              Dashboard
            </Link>
            <Link href="/scholar-review/dua-dhikr" style={navLinkStyle}>
              Duʿā &amp; Dhikr
            </Link>
            <Link href="/scholar-review/i-am-feeling" style={navLinkStyle}>
              I am feeling…
            </Link>
            <Link href="/scholar-review/summary" style={navLinkStyle}>
              Owner summary
            </Link>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
            <span style={{ color: "#6B6455" }}>Reviewing as {reviewerName}</span>
            <form action={logoutAction}>
              <button type="submit" style={{ background: "none", border: "1px solid #C9C2B1", borderRadius: 3, padding: "0.35rem 0.7rem", cursor: "pointer", fontSize: "0.82rem" }}>
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1.25rem 4rem" }}>{children}</main>
    </div>
  );
}

const navLinkStyle: React.CSSProperties = { color: "#0E3B2E", textDecoration: "none", fontWeight: 600 };
