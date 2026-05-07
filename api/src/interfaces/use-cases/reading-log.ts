import type { IReadingLog } from '../../@types/IReadingLog';

export interface IRegisterReadingLogUseCase {
  execute(
    readingLog: IReadingLog,
    userId: string,
    bookId: string,
  ): Promise<IReadingLog>;
}

export interface IGetReadingLogUseCase {
  execute(userId: string): Promise<IReadingLog[]>;
}

export interface IGetReadingLogBookIdUseCase {
  execute(bookId: string, userId: string): Promise<IReadingLog[]>;
}
