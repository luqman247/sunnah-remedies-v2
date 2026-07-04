/**
 * Alert routing — dispatches alerts to Slack, email, and PagerDuty.
 *
 * Implements severity tiers (info / warn / page), deduplication,
 * and quiet-hours suppression to prevent alert fatigue.
 */

import type { AlertSeverity } from "../lib/types";

interface AlertPayload {
  name: string;
  severity: AlertSeverity;
  message: string;
  metric: string;
  currentValue: number | string;
  threshold: number | string;
  timestamp: string;
}

const recentAlerts = new Map<string, number>();
const DEDUP_WINDOW_MS = 60 * 60 * 1000;

/**
 * Route an alert to the appropriate channel(s).
 */
export async function routeAlert(alert: AlertPayload): Promise<void> {
  if (isDuplicate(alert.name)) return;
  if (isSuppressed(alert.severity)) return;

  markSent(alert.name);

  const formattedMessage = formatAlertMessage(alert);

  switch (alert.severity) {
    case "page":
      await sendSlack(formattedMessage, "#critical-alerts");
      await sendEmail(formattedMessage, "oncall@sunnahremedies.com");
      await sendPagerDuty(alert);
      break;

    case "warn":
      await sendSlack(formattedMessage, getChannel(alert.name));
      await sendEmail(formattedMessage, getOwnerEmail(alert.name));
      break;

    case "info":
      await sendSlack(formattedMessage, getChannel(alert.name));
      break;
  }

  logAlert(alert);
}

/**
 * Check a metric against its threshold and fire an alert if breached.
 */
export async function checkThreshold(
  name: string,
  metric: string,
  currentValue: number,
  threshold: number,
  condition: "above" | "below",
  severity: AlertSeverity
): Promise<boolean> {
  const breached =
    condition === "above" ? currentValue > threshold : currentValue < threshold;

  if (breached) {
    await routeAlert({
      name,
      severity,
      message: `${name}: ${metric} is ${currentValue} (threshold: ${condition} ${threshold})`,
      metric,
      currentValue,
      threshold,
      timestamp: new Date().toISOString(),
    });
  }

  return breached;
}

/* ── Channel integration ───────────────────────────────────────── */

async function sendSlack(message: string, channel: string): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[Alert/Slack] No webhook URL configured");
    console.info(`[Alert/Slack] ${channel}: ${message}`);
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, text: message }),
    });
  } catch (error) {
    console.error("[Alert/Slack] Send failed:", error);
  }
}

async function sendEmail(message: string, to: string): Promise<void> {
  console.info(
    JSON.stringify({
      _type: "alert_email",
      to,
      message,
      timestamp: new Date().toISOString(),
    })
  );
}

async function sendPagerDuty(alert: AlertPayload): Promise<void> {
  const integrationKey = process.env.PAGERDUTY_INTEGRATION_KEY;
  if (!integrationKey) {
    console.warn("[Alert/PagerDuty] No integration key configured");
    console.info(`[Alert/PagerDuty] PAGE: ${alert.message}`);
    return;
  }

  try {
    await fetch("https://events.pagerduty.com/v2/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routing_key: integrationKey,
        event_action: "trigger",
        payload: {
          summary: alert.message,
          source: "sunnah-remedies-analytics",
          severity: "critical",
          custom_details: {
            metric: alert.metric,
            current_value: alert.currentValue,
            threshold: alert.threshold,
          },
        },
      }),
    });
  } catch (error) {
    console.error("[Alert/PagerDuty] Send failed:", error);
  }
}

/* ── Internal ──────────────────────────────────────────────────── */

function isDuplicate(name: string): boolean {
  const lastSent = recentAlerts.get(name);
  if (!lastSent) return false;
  return Date.now() - lastSent < DEDUP_WINDOW_MS;
}

function markSent(name: string): void {
  recentAlerts.set(name, Date.now());
}

function isSuppressed(severity: AlertSeverity): boolean {
  if (severity === "page") return false;

  const now = new Date();
  const hour = now.getHours();
  if (hour >= 22 || hour < 7) {
    return severity === "info";
  }

  return false;
}

function formatAlertMessage(alert: AlertPayload): string {
  const icon = alert.severity === "page" ? "🚨" : alert.severity === "warn" ? "⚠️" : "ℹ️";
  return `${icon} *${alert.name}*\n${alert.message}\nMetric: \`${alert.metric}\` = \`${alert.currentValue}\`\nTime: ${alert.timestamp}`;
}

function getChannel(alertName: string): string {
  const channelMap: Record<string, string> = {
    traffic_spike: "#analytics-alerts",
    traffic_drop: "#analytics-alerts",
    seo_ranking_drop: "#seo-alerts",
    broken_links: "#engineering-alerts",
    failed_searches_spike: "#editorial-alerts",
    low_stock: "#commerce-alerts",
    checkout_failure_spike: "#commerce-alerts",
    cwv_regression: "#engineering-alerts",
    ai_trust_drop: "#integrity-alerts",
    overdue_reviews: "#editorial-alerts",
  };
  return channelMap[alertName] || "#analytics-alerts";
}

function getOwnerEmail(alertName: string): string {
  const ownerMap: Record<string, string> = {
    low_stock: "commerce@sunnahremedies.com",
    checkout_failure_spike: "commerce@sunnahremedies.com",
    ai_trust_drop: "integrity@sunnahremedies.com",
    overdue_reviews: "editorial@sunnahremedies.com",
  };
  return ownerMap[alertName] || "engineering@sunnahremedies.com";
}

function logAlert(alert: AlertPayload): void {
  console.info(
    JSON.stringify({
      _type: "alert_log",
      ...alert,
    })
  );
}
