import { z } from 'zod';
import { StatusReading } from '../../generated/prisma/enums';

const createBookSchema = z.strictObject(
  {
    user_id: z.string('User id  is required').min(1, {
      error: 'User id is required',
    }),
    title: z.string('Title is required').trim().min(1, {
      error: 'Title is required',
    }),
    author: z
      .string({
        message: 'Author is required',
      })
      .trim()
      .min(1, {
        error: 'Author is required',
      }),
    genre: z.array(z.string()).min(1, {
      error: 'Genre is required',
    }),
    status: z.enum(StatusReading, {
      error: 'Status is required',
    }),
    total_pages: z
      .number({
        message: 'Total pages is required',
      })
      .min(1, {
        error: 'Total pages is required',
      }),
    start_date: z.iso.datetime({
      error: 'Date must be a valid date',
    }),
    end_date: z.iso
      .datetime({
        error: 'Date must be a valid date',
      })
      .optional(),
  },
  {
    error: 'Some provided field is not allowed.',
  },
);

export { createBookSchema };
