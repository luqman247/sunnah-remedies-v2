import { defineField, defineType } from "sanity";

export const campusLesson = defineType({
  name: "campusLesson",
  title: "Campus Lesson",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "course",
      title: "Course",
      type: "reference",
      to: [{ type: "campusCourse" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "body",
      title: "Lesson Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "video",
      title: "Lesson Video",
      type: "reference",
      to: [{ type: "videoAsset" }],
    }),
    defineField({
      name: "readingList",
      title: "Reading List",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "downloads",
      title: "Downloads",
      type: "array",
      of: [{ type: "downloadFile" }],
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      initialValue: "en",
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", order: "order" },
    prepare({ title, order }) {
      return { title: `${order}. ${title}` };
    },
  },
});
