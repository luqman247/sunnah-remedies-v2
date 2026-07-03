import { defineField, defineType } from "sanity";

export const propheticReference = defineType({
  name: "propheticReference",
  title: "Prophetic Reference",
  type: "object",
  fields: [
    defineField({
      name: "statement",
      title: "Statement",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "transliteration",
      title: "Transliteration",
      type: "string",
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      options: {
        list: [
          { title: "Established (Sahih)", value: "Established" },
          { title: "Reported (Hasan)", value: "Reported" },
          { title: "Tried (Classical Use)", value: "Tried" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "e.g. Sahih al-Bukhari · Hadith 5688",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "standing",
      title: "Standing",
      type: "string",
      description: "Scholarly commentary on the grade.",
    }),
    defineField({
      name: "siglum",
      title: "Siglum",
      type: "string",
      description: "Short reference code.",
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      options: {
        list: [
          { title: "Revelation (Qur'an)", value: "revelation" },
          { title: "Hadith", value: "hadith" },
          { title: "Classical Scholarship", value: "classical" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "source",
      subtitle: "grade",
    },
  },
});
