import type { IGoal } from '../../@types/IGoal';
import { UserNotFoundError } from '../../errors';
import type { IIdGeneratorAdapter } from '../../interfaces/adapters';
import type {
  ICreateGoalRepository,
  IGetUserByIdRepository,
} from '../../interfaces/repositories';

export class CreateGoalUseCase {
  private createGoalRepository: ICreateGoalRepository;
  private getUserByIdRepository: IGetUserByIdRepository;
  private idGeneratorAdapter: IIdGeneratorAdapter;

  constructor(
    createGoalRepository: ICreateGoalRepository,
    getUserByIdRepository: IGetUserByIdRepository,
    idGeneratorAdapter: IIdGeneratorAdapter,
  ) {
    this.createGoalRepository = createGoalRepository;
    this.getUserByIdRepository = getUserByIdRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
  }

  async execute(goal: IGoal) {
    const user = await this.getUserByIdRepository.execute(goal.user_id);

    if (!user) {
      throw new UserNotFoundError();
    }

    const goalId = this.idGeneratorAdapter.execute();

    const goalData = {
      ...goal,
      id: goalId,
    };

    return await this.createGoalRepository.execute(goalData);
  }
}
