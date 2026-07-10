import type { StructureBuilder, StructureResolver } from "sanity/structure";

function languageGroupedList(
  S: StructureBuilder,
  title: string,
  type: string,
) {
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

function productStatusList(
  S: StructureBuilder,
  title: string,
  filter: string,
  ordering: { field: string; direction: "asc" | "desc" }[] = [
    { field: "name", direction: "asc" },
  ],
) {
  return S.listItem()
    .title(title)
    .child(
      S.documentList()
        .title(title)
        .filter(filter)
        .defaultOrdering(ordering),
    );
}

export const structure: StructureResolver = (S) =>
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
                  S.document()
                    .schemaType("homepage")
                    .documentId("homepage"),
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
                .child(
                  S.documentTypeList("mediaAsset").title("Media Assets"),
                ),
            ]),
        ),

      S.divider(),

      // ── The Apothecary (Product Manager) ──
      S.listItem()
        .title("The Apothecary")
        .child(
          S.list()
            .title("The Apothecary")
            .items([
              languageGroupedList(S, "All Products", "product"),
              S.divider(),
              productStatusList(
                S,
                "Active Products",
                '_type == "product" && status == "active"',
                [
                  { field: "orderRank", direction: "asc" },
                  { field: "name", direction: "asc" },
                ],
              ),
              productStatusList(
                S,
                "Draft Products",
                '_type == "product" && status == "draft"',
              ),
              productStatusList(
                S,
                "Coming Soon",
                '_type == "product" && status == "coming-soon"',
              ),
              productStatusList(
                S,
                "Out of Stock",
                '_type == "product" && (status == "out-of-stock" || stockStatus == "out-of-stock")',
              ),
              productStatusList(
                S,
                "Archived",
                '_type == "product" && status == "archived"',
              ),
              productStatusList(
                S,
                "Featured Products",
                '_type == "product" && featured == true',
                [
                  { field: "featuredPriority", direction: "asc" },
                  { field: "name", direction: "asc" },
                ],
              ),
              productStatusList(
                S,
                "Visible in Apothecary",
                '_type == "product" && visibleInApothecary != false && status == "active"',
                [
                  { field: "orderRank", direction: "asc" },
                  { field: "name", direction: "asc" },
                ],
              ),
              S.divider(),
              languageGroupedList(S, "Categories", "category"),
              languageGroupedList(S, "Collections", "collection"),
              languageGroupedList(S, "Ingredients", "ingredient"),
              languageGroupedList(S, "Certifications", "certification"),
              languageGroupedList(S, "Brands", "brand"),
              S.divider(),
              S.listItem()
                .title("Media Library")
                .child(
                  S.list()
                    .title("Media Library")
                    .items([
                      S.listItem()
                        .title("All images")
                        .child(
                          S.documentTypeList("mediaAsset").title("All images"),
                        ),
                      S.listItem()
                        .title("Product images")
                        .child(
                          S.documentList()
                            .title("Product images")
                            .filter('_type == "mediaAsset" && assetClass == "product"')
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.listItem()
                        .title("Apothecary tagged")
                        .child(
                          S.documentList()
                            .title("Apothecary tagged")
                            .filter('_type == "mediaAsset" && "pillar:apothecary" in tags')
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.listItem()
                        .title("Final only")
                        .child(
                          S.documentList()
                            .title("Final images")
                            .filter('_type == "mediaAsset" && status == "final"')
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.listItem()
                        .title("Briefs (placeholders)")
                        .child(
                          S.documentList()
                            .title("Briefs")
                            .filter('_type == "mediaAsset" && status == "brief"')
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.listItem()
                        .title("QC pending")
                        .child(
                          S.documentList()
                            .title("QC pending")
                            .filter('_type == "mediaAsset" && qcStatus == "pending"')
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.listItem()
                        .title("Missing alt text")
                        .child(
                          S.documentList()
                            .title("Missing alt text")
                            .filter(
                              '_type == "mediaAsset" && decorative != true && !defined(alt)',
                            )
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.divider(),
                      S.listItem()
                        .title("All videos")
                        .child(
                          S.documentTypeList("videoAsset").title("All videos"),
                        ),
                      S.listItem()
                        .title("Apothecary videos")
                        .child(
                          S.documentList()
                            .title("Apothecary videos")
                            .filter(
                              '_type == "videoAsset" && "pillar:apothecary" in tags',
                            )
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.listItem()
                        .title("Player mode (needs poster)")
                        .child(
                          S.documentList()
                            .title("Player videos")
                            .filter('_type == "videoAsset" && mode == "player"')
                            .defaultOrdering([{ field: "title", direction: "asc" }]),
                        ),
                      S.divider(),
                      S.listItem()
                        .title("Audio assets")
                        .child(
                          S.documentTypeList("audioAsset").title("Audio assets"),
                        ),
                    ]),
                ),
              S.listItem()
                .title("Shopify join status")
                .child(
                  S.list()
                    .title("Shopify join status")
                    .items([
                      productStatusList(
                        S,
                        "Linked to Shopify",
                        '_type == "product" && defined(commerce.shopifyProductId)',
                      ),
                      productStatusList(
                        S,
                        "Reference only",
                        '_type == "product" && purchaseFraming == "reference-only"',
                      ),
                      productStatusList(
                        S,
                        "Needs Shopify link",
                        '_type == "product" && purchaseFraming != "reference-only" && !defined(commerce.shopifyProductId)',
                      ),
                    ]),
                ),
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
                  S.document()
                    .schemaType("charter")
                    .documentId("charter"),
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
                  S.document()
                    .schemaType("globalSeo")
                    .documentId("globalSeo"),
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
                  S.documentTypeList("operationalLog").title("Operational Logs"),
                ),
              S.listItem()
                .title("Compliance Register")
                .child(
                  S.documentTypeList("complianceEntry").title("Compliance Register"),
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
