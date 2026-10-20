import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/field-notes' }),
  schema: z.object({
    title: z.string(),
    // 110 to 160 characters. This is the search snippet.
    description: z.string().min(100).max(165),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** The service page this note supports. Every note links to one. */
    supports: z.string().startsWith('/'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { 'field-notes': fieldNotes };
