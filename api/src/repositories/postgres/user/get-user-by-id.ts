import { prisma } from '../../../lib/prisma';

export class PostgresGetUserByIdRepository {
  async execute(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        books: true,
        goals: true,
        notes: true,
        readingLogs: true,
      },
    });
  }
}
