import type { StatusReading } from '../../../generated/prisma/enums';
import { UserNotFoundError } from '../../errors';
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

    const books = await this.getMyBooksRepository.execute(
      user.id,
      search,
      genre,
      status,
    );

    return books;
  }
}
