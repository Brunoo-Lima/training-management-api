import { UserNotFoundError } from '../../errors';
import type {
  IGetReadingLogRepository,
  IGetUserByIdRepository,
} from '../../interfaces/repositories';

export class GetReadingLogUseCase {
  private getReadingLogRepository: IGetReadingLogRepository;
  private getUserByIdRepository: IGetUserByIdRepository;

  constructor(
    getReadingLogRepository: IGetReadingLogRepository,
    getUserByIdRepository: IGetUserByIdRepository,
  ) {
    this.getReadingLogRepository = getReadingLogRepository;
    this.getUserByIdRepository = getUserByIdRepository;
  }

  async execute(userId: string) {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const readingLog = await this.getReadingLogRepository.execute(user.id);

    if (readingLog.length === 0) {
      return [];
    }

    return readingLog;
  }
}
