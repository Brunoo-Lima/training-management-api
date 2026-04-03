import { z } from 'zod';

const createUserSchema = z.strictObject(
  {
    name: z.string('Name is required').trim().min(1, {
      error: 'Name is required',
    }),
    email: z
      .email({
        message: 'Invalid email. Please enter a valid email',
      })
      .trim()
      .min(1, {
        error: 'Email is required',
      }),
    password: z
      .string('Password is required')
      .trim()
      .min(6, { error: 'Password must be at least 6 characters' }),
  },
  {
    error: 'Some provided field is not allowed.',
  },
);

export type ICreateUserSchema = z.infer<typeof createUserSchema>;

export { createUserSchema };
