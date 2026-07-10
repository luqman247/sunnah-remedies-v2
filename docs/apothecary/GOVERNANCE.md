# Apothecary governance and security

## Roles (recommended)

| Role | Capabilities |
| --- | --- |
| Viewer | Read products and media |
| Editor | Create/edit drafts, generate AI drafts, upload media metadata |
| Publisher | Publish, archive, mark active, feature |
| Admin | Tokens, webhooks, schema, invitations |

## AI governance

- AI output is always `review-required` until an editor Approves or Rejects.
- Approve copies draft into editable fields; Publish remains a separate human step.
- Prompts forbid invented medical claims, certifications, hadith, and provenance.
- API keys stay on the server; Studio uses `SANITY_STUDIO_AI_ADMIN_TOKEN` only as a bearer to same-origin admin routes.

## Publishing governance

- Prefer **Archive** over delete.
- Public site shows only published documents that pass the visibility filter.
- Revalidation webhook must send `x-revalidation-secret`.
