/**
 * Phase 8 — Structured Logging
 *
 * Correlation-id-tagged structured logs. Routes to Axiom/Better Stack
 * in production. Console output in development.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  correlationId?: string;
  workflowName?: string;
  eventName?: string;
  service?: string;
  [key: string]: unknown;
}

function formatLog(level: LogLevel, message: string, context: LogContext = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      console.debug(JSON.stringify(formatLog("debug", message, context)));
    }
  },

  info(message: string, context?: LogContext) {
    console.info(JSON.stringify(formatLog("info", message, context)));
  },

  warn(message: string, context?: LogContext) {
    console.warn(JSON.stringify(formatLog("warn", message, context)));
  },

  error(message: string, context?: LogContext) {
    console.error(JSON.stringify(formatLog("error", message, context)));
  },
};

export function withCorrelation(correlationId: string) {
  return {
    debug: (msg: string, ctx?: LogContext) => logger.debug(msg, { ...ctx, correlationId }),
    info: (msg: string, ctx?: LogContext) => logger.info(msg, { ...ctx, correlationId }),
    warn: (msg: string, ctx?: LogContext) => logger.warn(msg, { ...ctx, correlationId }),
    error: (msg: string, ctx?: LogContext) => logger.error(msg, { ...ctx, correlationId }),
  };
}
