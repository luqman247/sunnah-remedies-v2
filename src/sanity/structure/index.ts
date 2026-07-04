import type { StructureBuilder } from "sanity/structure";

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
                  S.document()
                    .schemaType("homepage")
                    .documentId("homepage")
                ),
              S.listItem()
                .title("Navigation")
                .child(
                  S.document()
                    .schemaType("navigation")
                    .documentId("navigation")
                ),
              S.listItem()
                .title("Announcements")
                .child(
                  S.documentTypeList("announcement")
                    .title("Announcements")
                ),
              S.listItem()
                .title("Department Cards")
                .child(
                  S.documentTypeList("departmentCard")
                    .title("Department Cards")
                ),
              S.listItem()
                .title("Media Assets")
                .child(
                  S.documentTypeList("mediaAsset")
                    .title("Media Assets")
                ),
            ])
        ),

      S.divider(),

      // ── The Apothecary ──
      S.listItem()
        .title("The Apothecary")
        .child(
          S.list()
            .title("The Apothecary")
            .items([
              S.listItem()
                .title("Products")
                .child(
                  S.documentTypeList("product")
                    .title("Products")
                ),
              S.listItem()
                .title("Collections")
                .child(
                  S.documentTypeList("collection")
                    .title("Collections")
                ),
              S.listItem()
                .title("Categories")
                .child(
                  S.documentTypeList("category")
                    .title("Categories")
                ),
              S.listItem()
                .title("Ingredient Library")
                .child(
                  S.documentTypeList("ingredient")
                    .title("Ingredients")
                ),
            ])
        ),

      // ── The Academy ──
      S.listItem()
        .title("The Academy")
        .child(
          S.list()
            .title("The Academy")
            .items([
              S.listItem()
                .title("Programmes")
                .child(
                  S.documentTypeList("programme")
                    .title("Programmes")
                ),
              S.listItem()
                .title("Faculty")
                .child(
                  S.documentTypeList("faculty")
                    .title("Faculty")
                ),
            ])
        ),

      // ── Sacred Journeys ──
      S.listItem()
        .title("Sacred Journeys")
        .child(
          S.documentTypeList("journey")
            .title("Sacred Journeys")
        ),

      // ── Knowledge Library ──
      S.listItem()
        .title("Knowledge Library")
        .child(
          S.list()
            .title("Knowledge Library")
            .items([
              S.listItem()
                .title("Articles")
                .child(
                  S.documentTypeList("article")
                    .title("Articles")
                ),
              S.listItem()
                .title("Authors")
                .child(
                  S.documentTypeList("author")
                    .title("Authors")
                ),
              S.listItem()
                .title("Topics")
                .child(
                  S.documentTypeList("topic")
                    .title("Topics")
                ),
            ])
        ),

      // ── Clinical ──
      S.listItem()
        .title("Clinical")
        .child(
          S.document()
            .schemaType("consultationsPage")
            .documentId("consultationsPage")
            .title("Consultations Page")
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
                    .documentId("charter")
                ),
              S.listItem()
                .title("Institution Settings")
                .child(
                  S.document()
                    .schemaType("institutionSettings")
                    .documentId("institutionSettings")
                ),
              S.listItem()
                .title("Footer")
                .child(
                  S.document()
                    .schemaType("footerSettings")
                    .documentId("footerSettings")
                ),
              S.listItem()
                .title("Global SEO")
                .child(
                  S.document()
                    .schemaType("globalSeo")
                    .documentId("globalSeo")
                ),
            ])
        ),

      // ── Testimonials & FAQs ──
      S.listItem()
        .title("Testimonials & FAQs")
        .child(
          S.list()
            .title("Testimonials & FAQs")
            .items([
              S.listItem()
                .title("Testimonials")
                .child(
                  S.documentTypeList("testimonial")
                    .title("Testimonials")
                ),
              S.listItem()
                .title("FAQs")
                .child(
                  S.documentTypeList("faq")
                    .title("FAQs")
                ),
            ])
        ),

      S.divider(),

      // ── Operations (Phase 4) ──
      S.listItem()
        .title("Operations")
        .child(
          S.list()
            .title("Operations")
            .items([
              S.listItem()
                .title("Batch Records")
                .child(
                  S.documentTypeList("batchRecord")
                    .title("Batch Records")
                ),
              S.listItem()
                .title("Operational Logs")
                .child(
                  S.documentTypeList("operationalLog")
                    .title("Operational Logs")
                ),
              S.listItem()
                .title("Compliance Register")
                .child(
                  S.documentTypeList("complianceEntry")
                    .title("Compliance Register")
                ),
              S.listItem()
                .title("Decision Log")
                .child(
                  S.documentTypeList("decisionRecord")
                    .title("Decision Log")
                ),
              S.listItem()
                .title("Audit Findings")
                .child(
                  S.documentTypeList("auditFinding")
                    .title("Audit Findings")
                ),
            ])
        ),
    ]);
