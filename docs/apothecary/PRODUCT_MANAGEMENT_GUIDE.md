# Apothecary Product Management Guide

Plain-language guide for editors. Sanity is the single source of truth for product content.

## How to log in

1. Open the Studio: `/studio` on the site (for example `https://www.sunnahremedies.co.uk/studio`).
2. Sign in with your Sanity account (Google or email invitation from the project admin).
3. You should see tools including **Apothecary** and **Media Library** in the left sidebar.

If Studio asks to “Connect this studio”, ask an admin to allow the hostname in the Sanity project settings.

## How to create a product

1. Open **Apothecary** → **Products** (or Content → Product).
2. Choose template **Product (English)** or **Product (Dansk)**.
3. Fill Essentials: name, slug, nature, institutional summary, folio.
4. Set **Status** to `Draft` and leave **Visible in Apothecary** off until ready.
5. Add price, volume, and stock under Pricing / Inventory.
6. Save. Do **not** publish until media and copy are reviewed.

## How to change a price

1. Open the product document.
2. Go to **Pricing & Variants**.
3. Edit **Regular price** (and sale price if needed).
4. Click **Publish**.
5. The public monograph and catalogue update after revalidation (usually within a minute). Hard-refresh the public page if you still see the old price.

## How to replace an image

Preferred path (Media Library):

1. Open **Media Library** and create or update a media asset (Cloudinary public ID + alt text).
2. Open the product → **Media**.
3. Set **Primary Image (Media Library)** to that asset.
4. Publish.

Fallback:

1. On the product → **Media** → **Primary Image**, upload or replace the inline image and set alt text.
2. Publish.

## How to add gallery images

1. Product → **Media** → **Media Gallery**.
2. Add items. Prefer **From Media Library**; use inline upload only for one-offs.
3. Set role (primary, packaging, editorial, etc.) and display order.
4. Publish.

## How to add video

1. Create or select a **Video** asset in the Media Library (Cloudinary reference).
2. On the product → **Media**, attach under **Library Videos** or **Product Videos**.
3. Publish. Public pages never autoplay with sound.

## How to generate an AI description

1. Open the product document (name required).
2. Use the document action **Generate AI description**.
3. Wait for the draft to appear under the **AI Assistant** group (`aiDraft`).
4. Status will be **AI generated — review required**.

AI never invents medical claims, certifications, hadith, or provenance. It never publishes by itself.

## How to review AI text

1. Read `aiDraft` short description, full draft, and editor notes/warnings.
2. Edit the draft fields if needed.
3. Choose **Approve AI draft into fields** to copy the short description into the institutional summary (and fill empty historical context only).
4. Or choose **Reject AI draft**.
5. Manually edit any public fields you still want to change.
6. Only then **Publish**.

## How to publish

1. Confirm status is **Active** (document action **Mark as active** sets this and visibility).
2. Confirm **Visible in Apothecary** is on.
3. Click Sanity **Publish**.
4. Open `/the-apothecary` and the product slug to confirm.

## How to unpublish

1. In Sanity, use **Unpublish** on the document, **or**
2. Use **Mark as draft** (sets status draft and hides from Apothecary).

Draft and unpublished documents never appear on the public Apothecary.

## How to archive

1. Document action **Archive product**.
2. Status becomes archived; visibility is turned off; featured is cleared.
3. Prefer archive over delete. History stays recoverable via **Restore to draft**.

## How to preview

1. Document action **Preview on site** (uses draft mode when `SANITY_STUDIO_PREVIEW_SECRET` is configured).
2. Or open the production URL after publish: `/the-apothecary/{slug}` (Danish: `/dk/the-apothecary/{slug}`).

## How to troubleshoot missing updates

| Symptom | Check |
| --- | --- |
| Product missing on `/the-apothecary` | Status must be active / coming-soon / out-of-stock; Visible in Apothecary on; document published (not only saved draft) |
| Price/image/description stale | Publish the document; wait for webhook revalidation; hard-refresh; confirm you are on the correct locale (`/` vs `/dk`) |
| AI button fails | `AI_ADMIN_TOKEN` / `SANITY_STUDIO_AI_ADMIN_TOKEN` and `ANTHROPIC_API_KEY` must be set on the server |
| Image blank | Prefer Media Library Cloudinary ID; otherwise inline Sanity image with alt |
| Still seeing old static remedies | Until CMS products are published, the site may fall back to static files — publish migrated products as Active |

## Security reminders

- Never put Anthropic or admin tokens in public client code.
- Never publish AI text without human review.
- Do not invent health claims or unsupported Prophetic attributions.
