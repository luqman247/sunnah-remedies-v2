import { defineField, defineType } from "sanity";

export const institutionalImage = defineType({
  name: "institutionalImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Describe the image for accessibility and search engines.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "photographer",
      title: "Photographer",
      type: "string",
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string",
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Photography", value: "photography" },
          { title: "Illustration", value: "illustration" },
          { title: "Document", value: "document" },
          { title: "Product", value: "product" },
          { title: "Portrait", value: "portrait" },
          { title: "Architecture", value: "architecture" },
          { title: "Editorial", value: "editorial" },
        ],
      },
    }),
    defineField({
      name: "cloudinaryAssetId",
      title: "Cloudinary Asset ID",
      type: "string",
      description: "Future: Cloudinary delivery. Leave empty until migration.",
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "alt",
      media: "image",
    },
  },
});

export const institutionalVideo = defineType({
  name: "institutionalVideo",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "YouTube, Vimeo, or direct video URL.",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      description: "e.g. 12:34",
    }),
    defineField({
      name: "cloudinaryAssetId",
      title: "Cloudinary Asset ID",
      type: "string",
      hidden: true,
    }),
  ],
});

export const downloadFile = defineType({
  name: "downloadFile",
  title: "Download",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fileType",
      title: "File Type",
      type: "string",
      options: {
        list: [
          { title: "PDF", value: "pdf" },
          { title: "Document", value: "doc" },
          { title: "Spreadsheet", value: "xls" },
          { title: "Presentation", value: "ppt" },
          { title: "Audio", value: "audio" },
          { title: "Other", value: "other" },
        ],
      },
    }),
  ],
});
