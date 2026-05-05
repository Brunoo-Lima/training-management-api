import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../../../lib/prisma';
import { BookNotFoundError } from '../../../errors';
import type { IUpdateBook } from '../../../@types/IBook';

export class PostgresUpdateBookRepository {
  async execute(bookId: string, bookData: IUpdateBook) {
    try {
      return await prisma.book.update({
        where: {
          id: bookId,
        },
        data: bookData,
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
