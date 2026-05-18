import { prisma } from '../../../lib/prisma';

export class PostgresGetGoalByIdRepository {
  async execute(goalId: string) {
    return await prisma.goal.findFirst({
      where: {
        id: goalId,
      },
    });
  }
}
