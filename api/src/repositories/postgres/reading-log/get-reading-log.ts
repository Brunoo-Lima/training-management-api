import { prisma } from '../../../lib/prisma';

export class PostgresGetReadingLogRepository {
  async execute(userId: string) {
    return await prisma.readingLog.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
