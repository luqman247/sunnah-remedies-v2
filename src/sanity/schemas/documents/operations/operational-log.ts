import { defineField, defineType } from "sanity";

/**
 * Operational Log — A signed, timestamped record of routine operational events.
 *
 * Covers: daily opening/closing sign-offs, temperature logs, and any
 * other repeatable operational action that requires accountability.
 *
 * Architectural decision: a single flexible schema with a `type` discriminator
 * rather than separate schemas per log type. This keeps the schema count low
 * and allows new log types to be added without migration — only a new enum value.
 *
 * @see Phase 4, Chapter 03 — Opening/Closing SOPs
 * @see Phase 4, Chapter 05 — Temperature logging
 * @see Phase 4, Chapter 14 — Master checklists
 */
export const operationalLog = defineType({
  name: "operationalLog",
  title: "Operational Log",
  type: "document",
  fields: [
    defineField({
      name: "logType",
      title: "Log Type",
      type: "string",
      options: {
        list: [
          { title: "Daily Opening", value: "daily-opening" },
          { title: "Daily Closing", value: "daily-closing" },
          { title: "Temperature Log", value: "temperature" },
          { title: "Clinic Room Preparation", value: "clinic-prep" },
          { title: "Dispensary Readiness", value: "dispensary-readiness" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: "HH:MM in 24-hour format.",
      validation: (rule) =>
        rule.regex(/^\d{2}:\d{2}$/, { name: "time format" }).error("Must be HH:MM format (e.g. 09:30, 17:00)."),
    }),
    defineField({
      name: "signedBy",
      title: "Signed By",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "confirmed",
      title: "All Items Confirmed",
      type: "boolean",
      description: "The duty-holder confirms all checklist items were completed satisfactorily.",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "temperatureReadings",
      title: "Temperature Readings",
      type: "array",
      hidden: ({ parent }) => parent?.logType !== "temperature",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Record<string, unknown> | undefined;
          if (parent?.logType === "temperature" && (!value || (value as unknown[]).length === 0)) {
            return "At least one temperature reading is required for a temperature log.";
          }
          return true;
        }),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "location",
              title: "Location",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "temperature",
              title: "Temperature (°C)",
              type: "number",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "withinRange",
              title: "Within Acceptable Range",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { location: "location", temp: "temperature", ok: "withinRange" },
            prepare({ location, temp, ok }) {
              return {
                title: `${location}: ${temp}°C`,
                subtitle: ok ? "Within range" : "OUT OF RANGE",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "exceptions",
      title: "Exceptions / Issues Noted",
      type: "text",
      rows: 3,
      description: "Record anything that was not at standard, and the action taken.",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      type: "logType",
      date: "date",
      signedBy: "signedBy",
      confirmed: "confirmed",
    },
    prepare({ type, date, signedBy, confirmed }) {
      const typeLabels: Record<string, string> = {
        "daily-opening": "Opening",
        "daily-closing": "Closing",
        "temperature": "Temperature",
        "clinic-prep": "Clinic Prep",
        "dispensary-readiness": "Dispensary",
      };
      return {
        title: `${typeLabels[type] || type} — ${date || "No date"}`,
        subtitle: `${signedBy || "Unsigned"}${confirmed ? "" : " · INCOMPLETE"}`,
      };
    },
  },
  orderings: [
    {
      title: "Date (Newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
