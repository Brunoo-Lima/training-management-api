import { UserNotFoundError } from '../../errors';
import type {
  IGetGoalsRepository,
  IGetUserByIdRepository,
} from '../../interfaces/repositories';

export class GetGoalsUseCase {
  private getGoalsRepository: IGetGoalsRepository;
  private getUserByIdRepository: IGetUserByIdRepository;

  constructor(
    getGoalsRepository: IGetGoalsRepository,
    getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getGoalsRepository = getGoalsRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(userId: string) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return await this.getGoalsRepository.execute(userId);
  }
}
