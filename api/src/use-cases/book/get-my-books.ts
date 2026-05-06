import type { StatusReading } from '../../../generated/prisma/enums';
import {
  InvalidBookGenreError,
  InvalidBookStatusError,
  InvalidBookTitleError,
  UserNotFoundError,
} from '../../errors';
import type {
  IGetMyBooksRepository,
  IGetUserByIdRepository,
} from '../../interfaces/repositories';

export class GetMyBooksUseCase {
  private getMyBooksRepository: IGetMyBooksRepository;
  private getUserByIdRepository: IGetUserByIdRepository;

  constructor(
    getMyBooksRepository: IGetMyBooksRepository,
    getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getMyBooksRepository = getMyBooksRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(
    userId: string,
    search?: string,
    genre?: string,
    status?: StatusReading,
  ) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (
      status &&
      !['READING', 'COMPLETED', 'WISHLIST', 'ABANDONED'].includes(status)
    ) {
      throw new InvalidBookStatusError(status);
    }

    if (search && typeof search !== 'string') {
      throw new InvalidBookTitleError('Search must be a string');
    }

    if (genre && typeof genre !== 'string') {
      throw new InvalidBookGenreError(genre);
    }

    const books = await this.getMyBooksRepository.execute(
      user.id,
      search,
      genre,
      status,
    );

    return books;
  }
}
