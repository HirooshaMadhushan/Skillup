import { z } from 'zod';

export const createLessonSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  categoryId: z.string().uuid(),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  contentType: z.enum(['VIDEO', 'PDF', 'TEXT']).default('TEXT'),
  isPremium: z.string().transform(v => v === 'true').optional(), // Multi-part sends as string
  tags: z.string().optional(), // Tags as comma-separated string for multi-part
});

export const updateLessonSchema = createLessonSchema.partial();

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
