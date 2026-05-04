import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .email('Email is required. Please enter a valid email')
    .min(1, 'Email is required'),
  password: z
    .string('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string('Refresh token is required')
    .min(1, 'Refresh token is required'),
});
