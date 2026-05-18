import { prisma } from '../../../lib/prisma';

export class PostgresGetGoalsByIdRepository {
  async execute(goalId: string) {
    return await prisma.goal.findFirst({
      where: {
        id: goalId,
      },
    });
  }
}
