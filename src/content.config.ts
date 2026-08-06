import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { slugify } from "./utils/slugify";

const sites = defineCollection({
  loader: glob({
    pattern: "**/*.{yml,yaml}",
    base: "./src/data/sites",
  }),
});

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./blog",
  }),
  schema: z
    .object({
      title: z.string(),
      teaser: z.string().optional(),
      image: z.string().optional(),
      authors: z.array(z.string()).nonempty(),
      categories: z.array(z.string()).nonempty(),
      tags: z.array(z.string()).default([]),
      featured: z.union([z.string(), z.boolean()]).optional(),
      original: z
        .object({
          url: z.string(),
          date: z.coerce.date(),
          site: z.object({
            name: z.string(),
            url: z.string(),
          }),
        })
        .optional(),
    })
    .transform((data) => {
      return {
        ...data,
        image: data.image ?? `${slugify(data.categories[0]) || "sponsorships"}.png`,
      };
    }),
});

export const collections = {
  sites,
  blog,
};
