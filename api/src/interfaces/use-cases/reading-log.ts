import type { IReadingLog } from '../../@types/IReadingLog';

export interface IRegisterReadingLogUseCase {
  execute(
    readingLog: IReadingLog,
    userId: string,
    bookId: string,
  ): Promise<IReadingLog>;
}
