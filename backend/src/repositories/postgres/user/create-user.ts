import type { IUser } from '../../../@types/IUser';
import { prisma } from '../../../lib/prisma';

export class PostgresCreateUserRepository {
  async execute(user: IUser) {
    return await prisma.user.create({
      data: user,
    });
  }
}
