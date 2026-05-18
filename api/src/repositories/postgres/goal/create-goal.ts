import type { IGoal } from '../../../@types/IGoal';
import { prisma } from '../../../lib/prisma';

export class PostgresCreateGoalRepository {
  async execute(goal: IGoal) {
    return await prisma.goal.create({
      data: goal,
    });
  }
}
