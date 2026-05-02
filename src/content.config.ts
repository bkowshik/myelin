// Content Collections schema for the entries collection.
//
// Each entry is a Markdown file in src/content/entries/ named YYYY-MM-DD.md.
// The image referenced by the frontmatter sits alongside the markdown so the
// `./` relative path resolves cleanly and editing an entry only ever touches
// one folder. zod enforces the shape — a missing required field fails the
// build rather than silently rendering broken pages.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const entries = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/entries' }),
  schema: ({ image }) =>
    z.object({
      date: z.coerce.date(),
      image: image(),
      alt: z.string().min(1),
      caption: z.string().optional(),
    }),
});

export const collections = { entries };
