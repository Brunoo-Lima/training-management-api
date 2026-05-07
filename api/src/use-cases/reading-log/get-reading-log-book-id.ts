import { BookNotFoundError, UserNotFoundError } from '../../errors';
import type {
  IGetBookByIdRepository,
  IGetReadingLogBookIdRepository,
  IGetUserByIdRepository,
} from '../../interfaces/repositories';

export class GetReadingLogBookIdUseCase {
  private getReadingLogBookIdRepository: IGetReadingLogBookIdRepository;
  private getBookIdRepository: IGetBookByIdRepository;
  private getUserByIdRepository: IGetUserByIdRepository;

  constructor(
    getReadingLogBookIdRepository: IGetReadingLogBookIdRepository,
    getBookIdRepository: IGetBookByIdRepository,
    getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getReadingLogBookIdRepository = getReadingLogBookIdRepository;
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

    const readingLog = await this.getReadingLogBookIdRepository.execute(
      book.id,
      user.id,
    );

    if (readingLog.length === 0) {
      return [];
    }

    return readingLog;
  }
}
