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

  async execute(userId: string) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const books = await this.getMyBooksRepository.execute(user.id);

    return books;
  }
}
