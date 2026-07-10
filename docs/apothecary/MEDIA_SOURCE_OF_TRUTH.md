# Media source of truth

**Decision date:** 11 July 2026  
**Scope:** Apothecary Product Manager — Phase 3 Media Library

## Decision

| Layer | Owner | Responsibility |
|---|---|---|
| Metadata, rights, QC, tags, references | **Sanity** (`mediaAsset`, `videoAsset`, `audioAsset`) | Digital asset management |
| Binary delivery (interim / final) | **Cloudinary** | CDN, transforms, responsive delivery |
| Product pages | **Product documents** | Select library assets by reference; optional one-off inline uploads |

Sanity remains the editorial source of truth for *which* asset is used and *how it is described*. Cloudinary remains the delivery system for production binaries. We do **not** create a second product database or a competing asset store.

## Rules

1. Prefer **library references** on products (`primaryLibraryImage`, `mediaGallery[].libraryAsset`, `productVideos[].libraryVideo`).
2. Do not upload the same binary twice — reuse the library document.
3. Deletion is **blocked** while any document references the asset (Studio “Where used” / protected delete).
4. Videos: accepted formats `mp4`, `webm`, `mov`; editorial max ~500 MB; player mode requires poster + captions; **never autoplay with sound**.
5. Product photography uses `assetClass: product` so photography-brief fields are not forced.

## Studio entry points

- Tool: **Media Library** (overview counts)
- Structure → The Apothecary → Media Library → Images / Videos / Audio + filtered lists
- Product → Media tab → From Media Library

## Out of scope (later phases)

- Automated Cloudinary upload widget inside Studio
- Public Apothecary rendering of library references (Phase 5–6)
- Full duplicate detection pipeline (hash field + Find duplicates action are in place; hashing is manual/optional for now)
