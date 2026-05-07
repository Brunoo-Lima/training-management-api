import { prisma } from '../../../lib/prisma';

export class PostgresGetReadingLogsByBookIdRepository {
  async execute(bookId: string, userId: string) {
    return await prisma.readingLog.findMany({
      where: {
        book_id: bookId,
        user_id: userId,
      },
    });
  }
}
