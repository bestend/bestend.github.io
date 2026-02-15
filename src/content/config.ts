import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Optional short summary used for meta/OG description.
    description: z.string().optional(),
    date: z.date(),
  }),
});

export const collections = { posts };
