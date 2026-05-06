import type { IReadingLog } from '../../../@types/IReadingLog';
import { prisma } from '../../../lib/prisma';

export class PostgresRegisterReadingLogRepository {
  async execute(readingLog: IReadingLog) {
    return await prisma.readingLog.create({
      data: readingLog,
    });
  }
}
