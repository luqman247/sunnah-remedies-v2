# 13 — Localisation Plan

## Scope restriction

This document defines what **message-key namespace** a Dhikr feature would need in the existing localisation system. It contains **no actual translated strings** — no new entries are added to `src/messages/en.json` or `da.json` by this document.

## What is and isn't localised

| Content | Localised via existing i18n? | Notes |
|---|---|---|
| UI chrome (nav labels, buttons, category names, "My Progress" heading, etc.) | Yes | New `dhikr.*` namespace, same mechanism as rest of site |
| `titleEn`/`titleDa`, category `nameEn`/`nameDa` | Yes, as content-level localised fields (CMS, not message files) | See [04-dhikr-content-schema.md](04-dhikr-content-schema.md) |
| `translationEn`/`translationDa` of dhikr text | Yes, as content-level localised fields | Populated only after scholarly review ([03](03-authenticity-and-scholarly-review-policy.md)) |
| Arabic text | **Not locale-switched** | Renders identically regardless of site locale — see [09-arabic-content-presentation.md](09-arabic-content-presentation.md) |
| Transliteration | **Not locale-switched** | Single Latin-script rendering regardless of EN/DA |

## Proposed namespace

A new top-level key group, e.g. `dhikr.nav.*`, `dhikr.reader.*`, `dhikr.counter.*`, `dhikr.progress.*`, `dhikr.sourcing.*` — following whatever nesting convention is already used elsewhere in `en.json`/`da.json` (to be matched at implementation time, not re-specified here since it's an existing, working convention).

## Routing

Locale-prefixed routing for Dhikr pages follows `src/i18n/routing.ts` as-is (see [11-route-and-component-map.md](11-route-and-component-map.md)) — no new routing mechanism.

## Explicit non-goals

- No key is added to `en.json` or `da.json` by this document.
- No translation wording is proposed or drafted here.
