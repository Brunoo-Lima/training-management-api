import { prisma } from '../../../lib/prisma';

export class PostgresGetGoalsRepository {
  async execute(userId: string) {
    return await prisma.goal.findMany({
      where: {
        user_id: userId,
      },
    });
  }
}
