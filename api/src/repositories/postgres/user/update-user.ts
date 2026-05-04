import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserNotFoundError } from '../../../errors';
import type { IUpdateUser } from '../../../@types/IUser';
import { prisma } from '../../../lib/prisma';

export class PostgresUpdateUserRepository {
  async execute(userId: string, updateUserParams: IUpdateUser) {
    try {
      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: updateUserParams,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // P2025 = An operation failed because it depends on one or more records that were required but not found. {cause}
        if (error.code === 'P2025') {
          throw new UserNotFoundError(userId);
        }
      }

      throw error;
    }
  }
}
