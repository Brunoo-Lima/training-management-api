import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../../../lib/prisma';
import { BookNotFoundError } from '../../../errors';

export class PostgresDeleteBookRepository {
  async execute(bookId: string) {
    try {
      return await prisma.book.delete({
        where: {
          id: bookId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BookNotFoundError(bookId);
        }
      }

      throw error;
    }
  }
}
