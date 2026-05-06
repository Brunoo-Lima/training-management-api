import { z } from 'zod';

const registerReadingLogSchema = z.strictObject({
  pages_read: z
    .number({
      message: 'Pages read is required',
    })
    .min(1, { error: 'Pages read is required' }),
  date: z.iso.datetime({
    error: 'Date must be a valid date',
  }),
  notes_about_session: z.string().optional(),
});

export { registerReadingLogSchema };
