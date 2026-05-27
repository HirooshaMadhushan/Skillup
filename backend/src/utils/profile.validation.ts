import { z } from 'zod';

export const updateLearnerProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
  interests: z.string().optional(),
  learningGoals: z.string().optional(),
});

export const updateTutorProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().optional(),
  profileImage: z.string().url().optional(),
  expertise: z.string().optional(),
  qualification: z.string().optional(),
  experience: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  isAvailable: z.boolean().optional(),
});

export type UpdateLearnerInput = z.infer<typeof updateLearnerProfileSchema>;
export type UpdateTutorInput = z.infer<typeof updateTutorProfileSchema>;
