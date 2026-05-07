import type { IReadingLog } from '../../@types/IReadingLog';

export interface IRegisterReadingLogRepository {
  execute(readingLog: IReadingLog): Promise<IReadingLog>;
}

export interface IGetReadingLogRepository {
  execute(userId: string): Promise<IReadingLog[]>;
}

export interface IGetReadingLogBookIdRepository {
  execute(bookId: string, userId: string): Promise<IReadingLog[]>;
}
