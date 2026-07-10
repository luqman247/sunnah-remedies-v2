# Continuum Platform — P4: Search, Knowledge & AI Foundation

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 4 (§19), §9 (Search/Knowledge), §10 (AI), and module specs §4.7, §4.8, §4.9.
>
> **Duration:** 2 weeks · **Tier:** Capability

Make everything publishable discoverable and lay grounded-AI foundations. Publishing triggers indexing and embedding; semantic search and a governed, retrieval-grounded AI gateway come online with moderation and audit.

---

## Objectives

- Implement Search (§4.7): indexing, keyword/facets, filters, and the query interface.
- Implement Knowledge (§4.8): the knowledge graph, embeddings (pgvector), and the retrieval interface.
- Implement the AI gateway (§4.9): the OpenAI-compatible, provider-neutral model interface with RAG orchestration.
- Wire content.published/media.uploaded to indexing/embedding jobs (jobs land properly in Phase 5; interim inline handlers here).
- Add moderation and generation audit logging; enable AI media tagging (from Phase 2 seam).

## Deliverables

- modules/search with keyword+facet search over all indexed content.
- modules/knowledge with graph, embeddings, and retrieve().
- modules/ai with the model gateway, RAG orchestration, and moderation.
- Hybrid ranking seam (keyword+vector) behind the search interface.
- AI generation audit log and moderation gate.

## Repository changes

- Add modules/search, modules/knowledge, modules/ai.
- Implement search adapter (Meilisearch default; Algolia alt) and the AI adapter (OpenAI-compatible).
- Add pgvector to the PostgreSQL schema for embeddings.
- Subscribe indexing/embedding handlers to content/media events.

## Folder structure

```
modules/
├── search/
│   ├── index/          # index management + sync
│   ├── query/          # keyword, facets, filters, ranking
│   └── interface/      # search.query / index / related
├── knowledge/
│   ├── graph/          # entities + relationships
│   ├── embeddings/     # pgvector store + generation
│   ├── retrieval/      # retrieve(query, k) for RAG
│   └── interface/      # knowledge.embed / retrieve / graph
└── ai/
    ├── gateway/        # OpenAI-compatible model interface
    ├── rag/            # retrieve→assemble→generate→govern→log
    ├── moderation/     # policy screening
    └── interface/      # ai.assistant / moderate / translate
```

## Modules affected

- Search (§4.7)
- Knowledge (§4.8)
- AI (§4.9)
- CMS/Media — event sources
- Governance — policy hook (inert until Phase 8)

## Interfaces to implement

- search.query(q, filters) — ranked results.
- search.index(document) / search.remove(id).
- search.related(entityId) — relationship-driven recommendations.
- knowledge.embed(text) / knowledge.retrieve(query, k).
- knowledge.graph — entity/relationship queries.
- ai.assistant(persona).ask(input, context).
- ai.moderate(content) / ai.translate(text, locale).
- Events: ai.generation_logged.

## External services

- Meilisearch (default search) or Algolia (managed alternative) behind the search adapter.
- An OpenAI-compatible model provider (chat/completions/embeddings) behind the AI adapter.
- PostgreSQL + pgvector (embeddings store).

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| MEILISEARCH_HOST | Search host. | yes (if Meilisearch) |
| MEILISEARCH_API_KEY | Search admin key (secret manager). | yes (if Meilisearch) |
| ALGOLIA_APP_ID / ALGOLIA_ADMIN_KEY | Alternative managed search. | if Algolia |
| AI_API_BASE_URL | OpenAI-compatible endpoint. | yes |
| AI_API_KEY | Model provider key (secret manager). | yes |
| AI_EMBEDDING_MODEL | Embedding model id. | yes |
| AI_CHAT_MODEL | Default chat/completion model id. | yes |

## Acceptance criteria

- Publishing content triggers (re)indexing and embedding; deletion cascades to removal.
- Keyword search is typo-tolerant, faceted, and filterable; semantic search returns grounded results.
- AI generations are retrieval-grounded where facts matter, moderated, and logged for audit.
- Models are swappable by configuration through the OpenAI-compatible gateway — no code change.
- The Governance veto hook exists in the RAG pipeline (inert until Phase 8).

## Testing requirements

- Unit: index sync mapping, embedding generation, retrieval ranking, moderation policy screening.
- Integration: publish → indexed + embedded; query → ranked results; ask → grounded, cited, logged answer.
- AI safety: moderation blocks disallowed content; ungrounded factual answers are prevented where grounding applies.
- Swap test: change model config; confirm behaviour without code changes.

## Production readiness checklist

- [ ] Indexing/embedding runs off the critical editorial path (interim async here; formalised in Phase 5).
- [ ] AI keys in the secret manager; generation logs retained for audit.
- [ ] Moderation gate enforced on user and generated content.
- [ ] Search latency within budget; index rebuild procedure documented.
- [ ] Cost controls: embedding/generation rate limits and caching where applicable.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Index drift | Search falls out of sync with content. | Idempotent re-index; reconciliation job; rebuild runbook. |
| Ungrounded AI | Assistant asserts facts without sources. | RAG grounding + citations; refuse when retrieval is empty on factual queries; Governance hook. |
| Vendor lock-in | Direct SDK coupling to a model/search vendor. | All access via adapters behind the AI/Search interfaces; swap test in CI. |
| Cost blowout | Embeddings/generation costs scale unbounded. | Batch embeddings, cache, rate-limit, and budget-alert. |

## Dependencies

- Phase 0 (Core, adapters, events).
- Phase 2 (content/media as sources).
- Phase 3 (auth for AI/admin surfaces, rate limiting).

## Documentation updates

- Document Search, Knowledge, and AI interfaces and the RAG pipeline.
- ADR: embedding store (pgvector) and provider-neutral AI gateway.
- Update Platform Guide with discovery + AI capabilities and activation.
- Update Security Guide with AI moderation and generation-audit handling.

---

## Milestones & tasks

### Milestone 4.1 — Search indexing & query

**Objective.** All published content is discoverable via keyword and facets.

#### Task 4.1.1 — Implement the search adapter (Meilisearch)

- **Inputs:** Spec §2.3, §9; Meilisearch credentials.
- **Outputs:** The search adapter resolves to Meilisearch behind the search interface.
- **Files created:** `packages/adapters/search-meilisearch/`, `modules/search/interface/`
- **Files modified:** `adapters index`
- **Verification steps:**
  - Adapter connects and indexes a sample doc.
  - No search SDK leaks outside the adapter.
- **Manual QA steps:**
  - Index and query a sample document; confirm results and isolation.

#### Task 4.1.2 — Implement index management and content sync

- **Inputs:** Spec §9.2 indexing model; content.published event.
- **Outputs:** search.index/remove; a handler indexes on content.published and removes on delete.
- **Files created:** `modules/search/index/`
- **Files modified:** `search interface`, `subscription to content events`
- **Verification steps:**
  - Publish indexes the doc.
  - Delete removes it.
- **Manual QA steps:**
  - Publish, search, unpublish; confirm the item leaves the index.

#### Task 4.1.3 — Implement keyword search with facets and filters

- **Inputs:** Spec §9.1 keyword layer.
- **Outputs:** search.query(q, filters) returns typo-tolerant, faceted, filtered, ranked results.
- **Files created:** `modules/search/query/`
- **Files modified:** `search interface`
- **Verification steps:**
  - Typos still match.
  - Facets and filters narrow results correctly.
- **Manual QA steps:**
  - Run misspelled and filtered queries; confirm relevance and facet counts.

### Milestone 4.2 — Knowledge graph & embeddings

**Objective.** Content is embedded and relationship-aware for semantic retrieval.

#### Task 4.2.1 — Add pgvector and the embeddings store

- **Inputs:** Spec §4.8 embeddings; Postgres.
- **Outputs:** pgvector enabled; an embeddings table keyed to content.
- **Files created:** `prisma/pgvector migration`, `modules/knowledge/embeddings/`
- **Files modified:** `knowledge interface`
- **Verification steps:**
  - Vectors persist and are queryable by similarity.
  - Migration is reversible.
- **Manual QA steps:**
  - Store and nearest-neighbour query a few vectors; confirm ordering.

#### Task 4.2.2 — Implement embedding generation on publish

- **Inputs:** Spec §9.2; AI adapter (embeddings); content.published.
- **Outputs:** knowledge.embed(text) generates embeddings; a handler embeds content on publish.
- **Files created:** —
- **Files modified:** `modules/knowledge/embeddings`, `event subscription`
- **Verification steps:**
  - Publish produces an embedding.
  - Re-publish updates it idempotently.
- **Manual QA steps:**
  - Publish content; confirm an embedding row appears and updates on edit.

#### Task 4.2.3 — Build the knowledge graph (entities & relationships)

- **Inputs:** Spec §4.8 graph; content relationships (§6.1).
- **Outputs:** knowledge.graph exposes entities and relationships derived from content references.
- **Files created:** `modules/knowledge/graph/`
- **Files modified:** `knowledge interface`
- **Verification steps:**
  - Relationships reflect content references.
  - Graph updates on publish.
- **Manual QA steps:**
  - Link an Article to a Person; confirm the relationship appears in the graph.

#### Task 4.2.4 — Implement retrieval and hybrid-ranking seam

- **Inputs:** Spec §9.1 hybrid ranking; §4.8 retrieve().
- **Outputs:** knowledge.retrieve(query, k); search gains a hybrid keyword+vector ranking option behind its interface.
- **Files created:** `modules/knowledge/retrieval/`
- **Files modified:** `search query (hybrid option)`, `knowledge interface`
- **Verification steps:**
  - Semantic query returns grounded matches.
  - Hybrid ranking blends signals.
- **Manual QA steps:**
  - Run a natural-language query; confirm semantically relevant results.

### Milestone 4.3 — AI gateway & RAG

**Objective.** A provider-neutral, grounded, governed generation pipeline.

#### Task 4.3.1 — Implement the OpenAI-compatible AI adapter and gateway

- **Inputs:** Spec §2.4, §10; provider credentials.
- **Outputs:** ai.gateway exposes chat/completion/embeddings behind a provider-neutral interface.
- **Files created:** `packages/adapters/ai-openai-compatible/`, `modules/ai/gateway/`
- **Files modified:** `adapters index`, `ai interface`
- **Verification steps:**
  - Gateway returns completions.
  - Switching AI_CHAT_MODEL changes the model with no code change.
- **Manual QA steps:**
  - Swap the model via env; confirm behaviour changes without code edits.

#### Task 4.3.2 — Implement the RAG orchestration pipeline

- **Inputs:** Spec §10.1 (retrieve→assemble→generate→govern→log).
- **Outputs:** ai.assistant(persona).ask() retrieves grounding, generates a cited answer, screens it, and logs it.
- **Files created:** `modules/ai/rag/`
- **Files modified:** `ai interface`
- **Verification steps:**
  - Answers cite retrieved sources.
  - Empty retrieval on a factual query yields a safe refusal, not a guess.
- **Manual QA steps:**
  - Ask a grounded question; confirm citations. Ask an out-of-corpus fact; confirm safe handling.

#### Task 4.3.3 — Implement moderation and the Governance hook

- **Inputs:** Spec §10 moderation; §4.19 Governance veto (inert until Phase 8).
- **Outputs:** ai.moderate() screens content; the RAG pipeline calls a Governance permit() hook (no-op until Phase 8).
- **Files created:** `modules/ai/moderation/`
- **Files modified:** `ai rag pipeline`, `ai interface`
- **Verification steps:**
  - Disallowed content is blocked.
  - The Governance hook is invoked and currently permits by default.
- **Manual QA steps:**
  - Submit disallowed content; confirm moderation blocks it.

#### Task 4.3.4 — Log generations and enable AI media tagging

- **Inputs:** Spec §10 (generation audit); §4.4 AI tagging seam from Phase 2.
- **Outputs:** ai.generation_logged emitted with sources/decision; media AI tagging activated on media.uploaded.
- **Files created:** —
- **Files modified:** `modules/ai/rag (logging)`, `modules/media tagging handler`
- **Verification steps:**
  - Each generation writes an audit record.
  - New media receives AI tags.
- **Manual QA steps:**
  - Generate an answer; confirm the audit record. Upload media; confirm tags appear.

