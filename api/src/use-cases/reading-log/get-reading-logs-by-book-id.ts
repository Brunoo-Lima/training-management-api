import { BookNotFoundError, UserNotFoundError } from '../../errors';
import type {
  IGetBookByIdRepository,
  IGetReadingLogsByBookIdRepository,
  IGetUserByIdRepository,
} from '../../interfaces/repositories';

export class GetReadingLogsByBookIdUseCase {
  private getReadingLogsByBookIdRepository: IGetReadingLogsByBookIdRepository;
  private getBookIdRepository: IGetBookByIdRepository;
  private getUserByIdRepository: IGetUserByIdRepository;

  constructor(
    getReadingLogsByBookIdRepository: IGetReadingLogsByBookIdRepository,
    getBookIdRepository: IGetBookByIdRepository,
    getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getReadingLogsByBookIdRepository = getReadingLogsByBookIdRepository;
    this.getBookIdRepository = getBookIdRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(bookId: string, userId: string) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const book = await this.getBookIdRepository.execute(bookId);

    if (!book) {
      throw new BookNotFoundError();
    }

    const readingLog = await this.getReadingLogsByBookIdRepository.execute(
      book.id,
      user.id,
    );

    if (readingLog.length === 0) {
      return [];
    }

    return readingLog;
  }
}
