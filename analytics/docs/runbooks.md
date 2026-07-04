# Operational Runbooks — Analytics Platform

## 1. Data Subject Access Request (DSAR)

### Procedure
1. Receive request — verify identity of the data subject
2. Locate pseudonymous records:
   - GA4: Search by client_id or user_id in BigQuery export
   - Clarity: Session recordings by date/device (manual)
   - Warehouse: Query by pseudonymous customer key
3. Compile response — all data associated with the subject
4. Deliver within 30 days (UK GDPR / GDPR)

### Commands
```sql
-- Find all events for a pseudonymous client
SELECT * FROM `analytics_server_events.events`
WHERE client_id = '[CLIENT_ID]'
ORDER BY event_timestamp DESC;
```

## 2. Erasure Request (Right to be Forgotten)

### Procedure
1. Verify identity and request validity
2. Delete from GA4: Use User Deletion API
3. Delete from BigQuery: Run deletion query
4. Delete from Clarity: Remove session recordings (manual via dashboard)
5. Confirm deletion — audit log entry

### Commands
```bash
# GA4 User Deletion API
curl -X POST \
  'https://www.googleapis.com/analytics/v3/userDeletion/userDeletionRequests:upsert' \
  -H 'Authorization: Bearer [ACCESS_TOKEN]' \
  -H 'Content-Type: application/json' \
  -d '{
    "kind": "analytics#userDeletionRequest",
    "id": { "type": "CLIENT_ID", "userId": "[CLIENT_ID]" },
    "propertyId": "[GA4_PROPERTY_ID]"
  }'
```

```sql
-- BigQuery deletion
DELETE FROM `analytics_server_events.events`
WHERE client_id = '[CLIENT_ID]';

DELETE FROM `analytics_server_events.purchases`
WHERE client_id = '[CLIENT_ID]';

DELETE FROM `analytics_server_events.ai_interactions`
WHERE interaction_id IN (
  SELECT interaction_id FROM `analytics_server_events.ai_interactions`
  WHERE interaction_id LIKE '%[CLIENT_ID]%'
);
```

## 3. Alert Response

### Traffic Spike/Drop
1. Check Vercel dashboard for deployment correlation
2. Check GA4 Realtime for traffic source
3. If organic: check Search Console for ranking changes
4. If referral: identify source
5. Acknowledge alert in Slack

### Checkout Failure Spike (PAGE severity)
1. Check Stripe dashboard for payment processor issues
2. Check Shopify status page
3. Test checkout flow manually
4. If system issue: escalate to engineering
5. If provider issue: monitor and communicate

### AI Trust Drop (PAGE severity)
1. Review flagged uncited-claim responses in the review queue
2. Identify pattern: specific topics, sources, or time period
3. If systematic: disable AI responses for affected topics
4. If data quality: update knowledge base / RAG sources
5. Report to scholarly review board

### Core Web Vitals Regression
1. Identify the deploy that introduced the regression
2. Check Vercel Speed Insights for affected routes
3. If analytics-related: check script load order and size
4. If severe (LCP > 4s): rollback deploy
5. Fix and re-deploy with monitoring

## 4. GTM Rollback

### Disable all analytics without code deploy
1. Log into Google Tag Manager
2. Publish previous container version (pre-Phase 7)
3. All tags, triggers, and variables revert instantly
4. Verify: no analytics beacons in network tab
5. Document reason and timeline for re-enablement

## 5. Consent Re-prompt

### When to trigger
- Privacy policy update
- New processing activity added
- Consent framework version change

### Procedure
1. Update `CONSENT_VERSION` in `analytics/lib/consent.ts`
2. Deploy — all visitors will see the consent banner again
3. Previous consent is invalidated (version mismatch)
4. Monitor consent grant rate for 7 days
