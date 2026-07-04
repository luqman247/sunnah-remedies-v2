-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- BigQuery table definitions — analytics warehouse
-- Dataset: analytics_ga4_prod / analytics_server_events
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Server events table (first-party, source of truth for commerce/AI)
CREATE TABLE IF NOT EXISTS `analytics_server_events.events` (
  event_id STRING NOT NULL,
  event_name STRING NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  source STRING NOT NULL, -- webhook | server_action | ai | cron
  params JSON,
  client_id STRING,
  session_id STRING,
  pillar STRING,
  content_type STRING,
  ledger STRING, -- integrity | commercial | both
  consent_state STRING,
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(event_timestamp)
CLUSTER BY event_name, pillar, source;

-- Purchase events (server-truth, deduplicated)
CREATE TABLE IF NOT EXISTS `analytics_server_events.purchases` (
  transaction_id STRING NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  source STRING NOT NULL, -- shopify_webhook | stripe_webhook | client
  items JSON,
  value NUMERIC,
  currency STRING DEFAULT 'GBP',
  tax NUMERIC,
  shipping NUMERIC,
  coupon STRING,
  client_id STRING,
  is_reconciled BOOLEAN DEFAULT FALSE,
  reconciled_at TIMESTAMP
)
PARTITION BY DATE(event_timestamp)
CLUSTER BY source, currency;

-- AI interactions (Integrity Ledger)
CREATE TABLE IF NOT EXISTS `analytics_server_events.ai_interactions` (
  interaction_id STRING NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  query_topic STRING,
  pillar STRING,
  confidence NUMERIC,
  confidence_band STRING, -- high | medium | low
  citation_count INT64,
  has_uncited_claims BOOLEAN,
  is_fallback BOOLEAN,
  fallback_reason STRING,
  sources JSON,
  recommendations JSON,
  feedback_type STRING,
  feedback_rating INT64
)
PARTITION BY DATE(event_timestamp)
CLUSTER BY confidence_band, pillar;

-- Search events (gap engine source)
CREATE TABLE IF NOT EXISTS `analytics_server_events.search_events` (
  event_id STRING NOT NULL,
  event_timestamp TIMESTAMP NOT NULL,
  search_term STRING NOT NULL,
  result_count INT64,
  is_zero_result BOOLEAN,
  is_refinement BOOLEAN,
  previous_term STRING,
  selected_result STRING,
  pillar STRING
)
PARTITION BY DATE(event_timestamp)
CLUSTER BY is_zero_result, search_term;

-- Content freshness tracker
CREATE TABLE IF NOT EXISTS `analytics_server_events.content_freshness` (
  document_id STRING NOT NULL,
  document_type STRING NOT NULL,
  title STRING,
  slug STRING,
  last_updated TIMESTAMP,
  last_reviewed TIMESTAMP,
  freshness_status STRING, -- fresh | due_review | stale
  has_hadith BOOLEAN DEFAULT FALSE,
  has_clinical_content BOOLEAN DEFAULT FALSE,
  review_interval_days INT64 DEFAULT 180,
  assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
CLUSTER BY freshness_status, document_type;

-- Alert log (immutable audit)
CREATE TABLE IF NOT EXISTS `analytics_server_events.alert_log` (
  alert_id STRING NOT NULL,
  alert_name STRING NOT NULL,
  severity STRING NOT NULL, -- info | warn | page
  message STRING,
  metric STRING,
  current_value STRING,
  threshold STRING,
  routed_to STRING,
  timestamp TIMESTAMP NOT NULL,
  acknowledged_at TIMESTAMP,
  acknowledged_by STRING
)
PARTITION BY DATE(timestamp)
CLUSTER BY severity, alert_name;

-- Dashboard access audit (compliance)
CREATE TABLE IF NOT EXISTS `analytics_server_events.audit_log` (
  audit_id STRING NOT NULL,
  user_email STRING NOT NULL,
  action STRING NOT NULL,
  resource STRING,
  ip_address STRING,
  user_agent STRING,
  timestamp TIMESTAMP NOT NULL
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_email, action;

-- Data retention policy views
-- Raw event tables: 26 months (2 years + 2 months buffer)
-- Aggregated marts: permanent
-- PII-adjacent (client_id, session_id): 14 months, then hashed
