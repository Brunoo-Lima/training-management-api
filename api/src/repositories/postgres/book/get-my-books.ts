import type { StatusReading } from '../../../../generated/prisma/enums';
import { prisma } from '../../../lib/prisma';

export class PostgresGetMyBooksRepository {
  async execute(
    userId: string,
    search?: string,
    genre?: string,
    status?: StatusReading,
  ) {
    return await prisma.book.findMany({
      where: {
        user_id: userId,
        ...(search && { title: { contains: search, mode: 'insensitive' } }),
        ...(genre && { genre: { has: genre } }),
        ...(status && { status: { equals: status } }),
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
