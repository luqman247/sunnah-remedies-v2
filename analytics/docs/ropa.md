# Record of Processing Activities (ROPA)

## Sunnah Remedies — Analytics & Intelligence Platform

### Data Controller
Sunnah Remedies Ltd

### Processing Activities

| # | Activity | Purpose | Lawful basis | Data subjects | Data categories | Recipients | Retention | Transfer |
|---|----------|---------|-------------|---------------|-----------------|------------|-----------|----------|
| 1 | Website analytics (GA4) | Understand content effectiveness, improve services | Consent (analytics_storage) | Website visitors | Pseudonymous: client_id, session_id, page views, interactions. No PII | Google (GA4) | 14 months (GA4), permanent in warehouse (pseudonymous) | EU SCCs (Google) |
| 2 | Behavioural analytics (Clarity) | Identify UX friction, improve accessibility | Consent (analytics_storage) | Website visitors | Session recordings (text masked), click/scroll heatmaps. No PII | Microsoft (Clarity) | 30 days (Clarity) | EU SCCs (Microsoft) |
| 3 | Commerce tracking | Revenue truth, inventory management | Legitimate interest (business operations) | Customers | Order ID, items, value, currency. No customer PII in analytics | Google (GA4 MP), Shopify, Stripe | Per retention policy | EU SCCs |
| 4 | Course analytics | Education quality, curriculum improvement | Legitimate interest (educational mission) | Students | Pseudonymous: progress, quiz scores, completion. No student PII in analytics | Internal warehouse | Per retention policy | N/A (first-party) |
| 5 | Clinical event tracking | Service quality, attendance monitoring | Explicit consent (clinical data) | Patients | Appointment type, attendance status. No patient identity or health data in analytics | Internal warehouse | Per retention policy | N/A (first-party) |
| 6 | AI interaction monitoring | AI safety, trust, hallucination prevention | Legitimate interest (safety) | AI users | Query topics (normalised), confidence scores, citation metrics. No query content | Internal warehouse | Per retention policy | N/A (first-party) |
| 7 | Search analytics | Content gap identification, editorial commissioning | Consent (analytics_storage) | Searchers | Search terms, result counts, refinements. No PII | Internal warehouse | Per retention policy | N/A (first-party) |
| 8 | SEO monitoring | Organic visibility, indexation health | Legitimate interest (discoverability) | N/A (aggregate) | Rankings, CTR, impressions (aggregate from Search Console) | Google (Search Console) | Per Google retention | EU SCCs (Google) |
| 9 | Performance monitoring | Core Web Vitals, uptime, error detection | Legitimate interest (service quality) | Website visitors | Device type, page load times, error types. No PII | Vercel | Per Vercel retention | US (DPA with Vercel) |

### Data Protection Impact Assessment (DPIA)
Required before enabling:
- Google Signals
- Any remarketing or ad personalisation
- Any processing of special category data

### Sub-processors
| Processor | Purpose | DPA status |
|-----------|---------|------------|
| Google LLC | GA4, Search Console, BigQuery | DPA on file |
| Microsoft Corp | Clarity | DPA on file |
| Vercel Inc | Hosting, Analytics, Speed Insights | DPA on file |
| Shopify Inc | Commerce platform | DPA on file |
| Stripe Inc | Payment processing | DPA on file |

### Data Subject Rights
- DSAR procedure: see runbooks.md
- Erasure: GA4 User Deletion API + BigQuery record deletion
- Response SLA: 30 days (UK GDPR)
