import type { StructureBuilder } from "sanity/structure";
import DhikrReadinessPanel from "@/sanity/components/dhikr/DhikrReadinessPanel";

function languageGroupedList(S: StructureBuilder, title: string, type: string) {
  return S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .title("English")
            .child(
              S.documentList()
                .title(`${title} — English`)
                .filter(`_type == "${type}" && language == "en"`),
            ),
          S.listItem()
            .title("Dansk")
            .child(
              S.documentList()
                .title(`${title} — Dansk`)
                .filter(`_type == "${type}" && language == "da"`),
            ),
          S.divider(),
          S.listItem()
            .title("Needs translation")
            .child(
              S.documentList()
                .title(`${title} — Needs translation`)
                .filter(
                  `_type == "${type}" && language == "da" && translationStatus.state == "needsTranslation"`,
                ),
            ),
          S.listItem()
            .title("AI drafts to review")
            .child(
              S.documentList()
                .title(`${title} — AI drafts`)
                .filter(
                  `_type == "${type}" && language == "da" && translationStatus.state == "aiDraft"`,
                ),
            ),
          S.divider(),
          S.listItem()
            .title("All")
            .child(S.documentTypeList(type).title(`All ${title}`)),
        ]),
    );
}

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Sunnah Remedies")
    .items([
      // ── Editorial ──
      S.listItem()
        .title("Editorial")
        .child(
          S.list()
            .title("Editorial")
            .items([
              S.listItem()
                .title("Homepage")
                .child(
                  S.list()
                    .title("Homepage")
                    .items([
                      S.listItem()
                        .title("Homepage document")
                        .child(
                          S.document()
                            .schemaType("homepage")
                            .documentId("homepage"),
                        ),
                      languageGroupedList(
                        S,
                        "Latest additions",
                        "homepageHighlight",
                      ),
                    ]),
                ),
              S.listItem()
                .title("Navigation")
                .child(
                  S.document()
                    .schemaType("navigation")
                    .documentId("navigation"),
                ),
              languageGroupedList(S, "Announcements", "announcement"),
              languageGroupedList(S, "Department Cards", "departmentCard"),
              S.listItem()
                .title("Media Assets")
                .child(S.documentTypeList("mediaAsset").title("Media Assets")),
            ]),
        ),

      S.divider(),

      // ── The Apothecary ──
      S.listItem()
        .title("The Apothecary")
        .child(
          S.list()
            .title("The Apothecary")
            .items([
              languageGroupedList(S, "Products", "product"),
              languageGroupedList(S, "Collections", "collection"),
              languageGroupedList(S, "Categories", "category"),
              languageGroupedList(S, "Ingredients", "ingredient"),
            ]),
        ),

      // ── The Academy ──
      S.listItem()
        .title("The Academy")
        .child(
          S.list()
            .title("The Academy")
            .items([
              languageGroupedList(S, "Programmes", "programme"),
              languageGroupedList(S, "Faculty", "faculty"),
            ]),
        ),

      // ── Sacred Journeys ──
      languageGroupedList(S, "Sacred Journeys", "journey"),

      // ── Knowledge Library ──
      S.listItem()
        .title("Knowledge Library")
        .child(
          S.list()
            .title("Knowledge Library")
            .items([
              languageGroupedList(S, "Articles", "article"),
              languageGroupedList(S, "Authors", "author"),
              languageGroupedList(S, "Topics", "topic"),
            ]),
        ),

      // ── Daily Dhikr ──
      // Minimal Stage 2B section: two plain lists, no filtered workflow
      // sub-lists yet. Dhikr Items' document editor gets a second view
      // ("Publication Readiness") alongside the normal form view; Dhikr
      // Categories has no custom view yet.
      S.listItem()
        .title("Daily Dhikr")
        .child(
          S.list()
            .title("Daily Dhikr")
            .items([
              S.listItem()
                .title("Dhikr Items")
                .child(
                  S.documentTypeList("dhikrItem")
                    .title("Dhikr Items")
                    .child((documentId) =>
                      S.document()
                        .schemaType("dhikrItem")
                        .documentId(documentId)
                        .views([
                          S.view.form(),
                          S.view
                            .component(DhikrReadinessPanel)
                            .id("readiness")
                            .title("Publication Readiness"),
                        ]),
                    ),
                ),
              S.listItem()
                .title("Dhikr Categories")
                .child(
                  S.documentTypeList("dhikrCategory").title("Dhikr Categories"),
                ),
            ]),
        ),

      // ── Duʿa & Dhikr (extends Daily Dhikr — see docs/dua-dhikr/) ──
      S.listItem()
        .title("Duʿa & Dhikr")
        .child(
          S.list()
            .title("Duʿa & Dhikr")
            .items([
              S.listItem()
                .title("Collections")
                .child(
                  S.documentTypeList("duaDhikrCollection").title(
                    "Duʿa & Dhikr Collections",
                  ),
                ),
              S.listItem()
                .title("Entries")
                .child(
                  S.documentTypeList("duaDhikrEntry").title(
                    "Duʿa & Dhikr Entries",
                  ),
                ),
            ]),
        ),

      // ── "I am feeling…" (curates Duʿa & Dhikr — see docs/i-am-feeling/) ──
      S.listItem()
        .title("I am feeling…")
        .child(
          S.list()
            .title("I am feeling…")
            .items([
              S.listItem()
                .title("Families")
                .child(
                  S.documentTypeList("feelingFamily").title(
                    "I am feeling… Families",
                  ),
                ),
              S.listItem()
                .title("Feeling States")
                .child(
                  S.documentTypeList("feelingState").title(
                    "I am feeling… Feeling States",
                  ),
                ),
            ]),
        ),

      // ── Clinical ──
      S.listItem()
        .title("Clinical")
        .child(
          S.document()
            .schemaType("consultationsPage")
            .documentId("consultationsPage")
            .title("Consultations Page"),
        ),

      S.divider(),

      // ── Institution ──
      S.listItem()
        .title("Institution")
        .child(
          S.list()
            .title("Institution")
            .items([
              S.listItem()
                .title("Founding Charter")
                .child(
                  S.document().schemaType("charter").documentId("charter"),
                ),
              S.listItem()
                .title("Institution Settings")
                .child(
                  S.document()
                    .schemaType("institutionSettings")
                    .documentId("institutionSettings"),
                ),
              S.listItem()
                .title("Footer")
                .child(
                  S.document()
                    .schemaType("footerSettings")
                    .documentId("footerSettings"),
                ),
              S.listItem()
                .title("Global SEO")
                .child(
                  S.document().schemaType("globalSeo").documentId("globalSeo"),
                ),
            ]),
        ),

      // ── Testimonials & FAQs ──
      S.listItem()
        .title("Testimonials & FAQs")
        .child(
          S.list()
            .title("Testimonials & FAQs")
            .items([
              languageGroupedList(S, "Testimonials", "testimonial"),
              languageGroupedList(S, "FAQs", "faq"),
            ]),
        ),

      S.divider(),

      // ── Operations (internal, not translatable) ──
      S.listItem()
        .title("Operations")
        .child(
          S.list()
            .title("Operations")
            .items([
              S.listItem()
                .title("Batch Records")
                .child(
                  S.documentTypeList("batchRecord").title("Batch Records"),
                ),
              S.listItem()
                .title("Operational Logs")
                .child(
                  S.documentTypeList("operationalLog").title(
                    "Operational Logs",
                  ),
                ),
              S.listItem()
                .title("Compliance Register")
                .child(
                  S.documentTypeList("complianceEntry").title(
                    "Compliance Register",
                  ),
                ),
              S.listItem()
                .title("Decision Log")
                .child(
                  S.documentTypeList("decisionRecord").title("Decision Log"),
                ),
              S.listItem()
                .title("Audit Findings")
                .child(
                  S.documentTypeList("auditFinding").title("Audit Findings"),
                ),
            ]),
        ),
    ]);
