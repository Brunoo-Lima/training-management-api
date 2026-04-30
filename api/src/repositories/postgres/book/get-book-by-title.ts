import { prisma } from '../../../lib/prisma';

export class PostgresGetBookByTitleRepository {
  async execute(title: string) {
    return await prisma.book.findFirst({
      where: {
        title,
      },
    });
  }
}
