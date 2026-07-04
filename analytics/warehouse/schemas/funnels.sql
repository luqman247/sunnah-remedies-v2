-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Funnel model views — stage-to-stage conversion
-- Built over the GA4 export + server events
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Commerce (Apothecary) funnel
-- Homepage → Knowledge → Product → Cart → Checkout → Purchase
CREATE OR REPLACE VIEW `analytics_marts.funnel_commerce` AS
WITH stages AS (
  SELECT
    user_pseudo_id,
    CASE event_name
      WHEN 'page_view' THEN 1
      WHEN 'article_view' THEN 2
      WHEN 'view_item' THEN 3
      WHEN 'add_to_cart' THEN 4
      WHEN 'begin_checkout' THEN 5
      WHEN 'purchase' THEN 6
    END AS stage_number,
    event_name,
    event_timestamp
  FROM `analytics_ga4_prod.events_*`
  WHERE event_name IN (
    'page_view', 'article_view', 'entity_view',
    'view_item', 'add_to_cart', 'begin_checkout', 'purchase'
  )
),
stage_counts AS (
  SELECT
    stage_number,
    event_name,
    COUNT(DISTINCT user_pseudo_id) AS users
  FROM stages
  GROUP BY stage_number, event_name
)
SELECT
  event_name AS stage,
  stage_number,
  users,
  LAG(users) OVER (ORDER BY stage_number) AS previous_stage_users,
  SAFE_DIVIDE(users, LAG(users) OVER (ORDER BY stage_number)) AS conversion_rate
FROM stage_counts
ORDER BY stage_number;

-- Course (Academy) funnel
-- Homepage → Academy → Course → Curriculum → Application → Purchase → Student Portal
CREATE OR REPLACE VIEW `analytics_marts.funnel_academy` AS
WITH stages AS (
  SELECT
    user_pseudo_id,
    CASE event_name
      WHEN 'page_view' THEN 1
      WHEN 'course_view' THEN 2
      WHEN 'curriculum_view' THEN 3
      WHEN 'course_application_start' THEN 4
      WHEN 'purchase' THEN 5
      WHEN 'lesson_start' THEN 6
    END AS stage_number,
    event_name,
    event_timestamp
  FROM `analytics_ga4_prod.events_*`
  WHERE event_name IN (
    'page_view', 'course_view', 'curriculum_view',
    'course_application_start', 'purchase', 'lesson_start'
  )
),
stage_counts AS (
  SELECT
    stage_number,
    event_name,
    COUNT(DISTINCT user_pseudo_id) AS users
  FROM stages
  WHERE stage_number IS NOT NULL
  GROUP BY stage_number, event_name
)
SELECT
  event_name AS stage,
  stage_number,
  users,
  LAG(users) OVER (ORDER BY stage_number) AS previous_stage_users,
  SAFE_DIVIDE(users, LAG(users) OVER (ORDER BY stage_number)) AS conversion_rate
FROM stage_counts
ORDER BY stage_number;

-- Consultation (Clinical) funnel
-- Homepage → Knowledge → Consultation → Booking → Intake → Appointment
CREATE OR REPLACE VIEW `analytics_marts.funnel_clinical` AS
WITH stages AS (
  SELECT
    user_pseudo_id,
    CASE event_name
      WHEN 'page_view' THEN 1
      WHEN 'article_view' THEN 2
      WHEN 'consultation_view' THEN 3
      WHEN 'booking_start' THEN 4
      WHEN 'intake_complete' THEN 5
      WHEN 'appointment_attended' THEN 6
    END AS stage_number,
    event_name,
    event_timestamp
  FROM `analytics_ga4_prod.events_*`
  WHERE event_name IN (
    'page_view', 'article_view', 'entity_view',
    'consultation_view', 'booking_start',
    'intake_complete', 'appointment_attended'
  )
),
stage_counts AS (
  SELECT
    stage_number,
    event_name,
    COUNT(DISTINCT user_pseudo_id) AS users
  FROM stages
  WHERE stage_number IS NOT NULL
  GROUP BY stage_number, event_name
)
SELECT
  event_name AS stage,
  stage_number,
  users,
  LAG(users) OVER (ORDER BY stage_number) AS previous_stage_users,
  SAFE_DIVIDE(users, LAG(users) OVER (ORDER BY stage_number)) AS conversion_rate
FROM stage_counts
ORDER BY stage_number;

-- Journey (Sacred Journeys) funnel
-- Homepage → Sacred Journeys → Programme → Booking → Preparation → Travel
CREATE OR REPLACE VIEW `analytics_marts.funnel_journeys` AS
WITH stages AS (
  SELECT
    user_pseudo_id,
    CASE event_name
      WHEN 'page_view' THEN 1
      WHEN 'journey_view' THEN 2
      WHEN 'programme_view' THEN 3
      WHEN 'journey_booking_start' THEN 4
      WHEN 'journey_deposit' THEN 5
      WHEN 'preparation_open' THEN 6
    END AS stage_number,
    event_name,
    event_timestamp
  FROM `analytics_ga4_prod.events_*`
  WHERE event_name IN (
    'page_view', 'journey_view', 'programme_view',
    'journey_booking_start', 'journey_deposit', 'preparation_open'
  )
),
stage_counts AS (
  SELECT
    stage_number,
    event_name,
    COUNT(DISTINCT user_pseudo_id) AS users
  FROM stages
  WHERE stage_number IS NOT NULL
  GROUP BY stage_number, event_name
)
SELECT
  event_name AS stage,
  stage_number,
  users,
  LAG(users) OVER (ORDER BY stage_number) AS previous_stage_users,
  SAFE_DIVIDE(users, LAG(users) OVER (ORDER BY stage_number)) AS conversion_rate
FROM stage_counts
ORDER BY stage_number;

-- Two-Ledger executive mart
CREATE OR REPLACE VIEW `analytics_marts.two_ledger_summary` AS
SELECT
  -- Commercial Ledger
  (SELECT COUNT(*) FROM `analytics_server_events.purchases`
   WHERE DATE(event_timestamp) = CURRENT_DATE()) AS orders_today,

  (SELECT SUM(value) FROM `analytics_server_events.purchases`
   WHERE DATE(event_timestamp) = CURRENT_DATE()) AS revenue_today,

  (SELECT AVG(value) FROM `analytics_server_events.purchases`
   WHERE DATE(event_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) AS avg_order_value_30d,

  -- Integrity Ledger
  (SELECT SAFE_DIVIDE(
    COUNTIF(event_name = 'certificate_issued'),
    COUNTIF(event_name = 'course_enrol'))
   FROM `analytics_server_events.events`
   WHERE DATE(event_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)) AS course_completion_rate_90d,

  (SELECT SAFE_DIVIDE(
    COUNTIF(NOT has_uncited_claims),
    COUNT(*))
   FROM `analytics_server_events.ai_interactions`
   WHERE DATE(event_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) AS ai_trust_score_30d,

  (SELECT SAFE_DIVIDE(
    COUNTIF(citation_count > 0),
    COUNT(*))
   FROM `analytics_server_events.ai_interactions`
   WHERE DATE(event_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)) AS ai_citation_rate_30d,

  (SELECT COUNTIF(freshness_status = 'stale')
   FROM `analytics_server_events.content_freshness`) AS stale_content_count,

  CURRENT_TIMESTAMP() AS computed_at;
