import type { GoalsType } from '../../generated/prisma/enums';

export interface IGoal {
  id: string;
  user_id: string;
  type: GoalsType;
  target_value: number;
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
