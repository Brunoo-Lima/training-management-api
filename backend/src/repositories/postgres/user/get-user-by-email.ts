import { prisma } from '../../../lib/prisma';

export class GetUserByEmailRepository {
  async execute(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
