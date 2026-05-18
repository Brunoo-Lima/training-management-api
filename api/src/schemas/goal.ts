import { z } from 'zod';
import { GoalsType } from '../../generated/prisma/enums';

export const createGoalSchema = z.strictObject(
  {
    type: z.enum(GoalsType, {
      error: 'Type is required',
    }),
    target_value: z
      .number({
        message: 'Target value is required',
      })
      .min(1, { error: 'Target value is required' }),
    start_date: z.iso.datetime({
      error: 'Date must be a valid date',
    }),
    end_date: z.iso.datetime().optional(),
  },
  {
    error: 'Some provided field is not allowed.',
  },
);
