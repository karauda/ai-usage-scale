import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const manifesto = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/manifesto' }),
  schema: z.object({
    lang: z.string(),
    title: z.string(),
    standfirst: z.string(),
    version: z.string(),
    level: z.number().int().min(0).max(5),
  }),
});

export const collections = { manifesto };
