import type { IReadingLog } from '../../@types/IReadingLog';

export interface IRegisterReadingLogRepository {
  execute(readingLog: IReadingLog): Promise<IReadingLog>;
}
