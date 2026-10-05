import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters long').max(150),
  phone: z.string().max(30).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  village: z.string().max(150).optional().nullable(),
  preferred_language: z.string().max(50).default('English'),
  farming_experience_years: z.number().int().nonnegative().optional().default(0)
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(150),
  phone: z.string().max(30).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  village: z.string().max(150).optional().nullable(),
  preferred_language: z.string().max(50).default('English'),
  farming_experience_years: z.number().int().nonnegative().default(0)
});
