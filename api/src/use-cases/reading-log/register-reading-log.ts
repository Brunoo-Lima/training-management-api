import type { IReadingLog } from '../../@types/IReadingLog';
import { BookNotFoundError, UserNotFoundError } from '../../errors';
import type {
  IGetBookByIdRepository,
  IGetUserByIdRepository,
  IRegisterReadingLogRepository,
} from '../../interfaces/repositories';

export class RegisterReadingLogUseCase {
  private registerReadingLogRepository: IRegisterReadingLogRepository;
  private getUserByIdRepository: IGetUserByIdRepository;
  private getBookByIdRepository: IGetBookByIdRepository;

  constructor(
    registerReadingLogRepository: IRegisterReadingLogRepository,
    getUserByIdRepository: IGetUserByIdRepository,
    getBookByIdRepository: IGetBookByIdRepository,
  ) {
    this.registerReadingLogRepository = registerReadingLogRepository;
    this.getUserByIdRepository = getUserByIdRepository;
    this.getBookByIdRepository = getBookByIdRepository;
  }

  async execute(readingLog: IReadingLog, userId: string, bookId: string) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const book = await this.getBookByIdRepository.execute(bookId);

    if (!book) {
      throw new BookNotFoundError();
    }

    const readingLogData = {
      ...readingLog,
      user_id: user.id,
      book_id: book.id,
    };

    return await this.registerReadingLogRepository.execute(readingLogData);
  }
}
