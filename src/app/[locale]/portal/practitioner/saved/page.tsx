import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { ListingRow } from "@/components/ui/Attestation";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";
import { getSavedResources, searchSavedResources } from "@/modules/practitioner/resources";

export const metadata: Metadata = {
  title: "Saved resources",
  description: "Private bookmarks across the practitioner portal",
};

export default async function SavedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const session = await requirePractitionerPortal("/portal/practitioner/saved");
  const saved = q
    ? await searchSavedResources(session.accountId, q)
    : await getSavedResources(session.accountId);

  return (
    <PractitionerSectionPage
      folio="x"
      title="Saved resources"
      lede="Private bookmarks — visible only to you, never ranked or shared"
      currentHref="/portal/practitioner/saved"
      breadcrumbLabel="Saved resources"
    >
      <form method="get" style={{ marginBottom: "var(--s5)" }}>
        <label htmlFor="resource-search" className="type-micro">
          Search saved resources
        </label>
        <input
          id="resource-search"
          name="q"
          type="search"
          defaultValue={q ?? ""}
          className="type-body"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "32rem",
            marginTop: "var(--s1)",
            padding: "var(--s2)",
            border: "1px solid var(--rule)",
            background: "var(--paper)",
          }}
        />
      </form>

      {saved.length === 0 ? (
        <p className="type-body">
          {q ? "No saved resources match your search" : "No saved resources yet"}
        </p>
      ) : (
        saved.map((r) => (
          <ListingRow
            key={r.id}
            title={r.title}
            provenance={r.targetType.replace(/_/g, " ")}
            href={r.href ?? "#"}
          />
        ))
      )}
    </PractitionerSectionPage>
  );
}
