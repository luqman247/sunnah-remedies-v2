import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="leaf" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
      <div className="measure-wide" style={{ textAlign: "center", maxWidth: "var(--measure-reading)", margin: "0 auto" }}>
        <p className="type-eyebrow" style={{ marginBottom: "var(--s4)" }}>
          {t("heading")}
        </p>
        <h1 className="type-display-l" style={{ marginBottom: "var(--s4)" }}>
          {t("subheading")}
        </h1>
        <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s6)" }}>
          {t("body")}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s5)", justifyContent: "center" }}>
          <Link href="/" className="quiet-link">
            {t("returnHome")}
          </Link>
          <Link href="/knowledge-library" className="quiet-link">
            {t("knowledgeLibrary")}
          </Link>
          <Link href="/the-apothecary" className="quiet-link">
            {t("theApothecary")}
          </Link>
          <Link href="/the-academy" className="quiet-link">
            {t("theAcademy")}
          </Link>
        </div>
      </div>
    </div>
  );
}
