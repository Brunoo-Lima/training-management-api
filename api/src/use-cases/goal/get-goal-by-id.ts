import { GoalNotFoundError } from '../../errors';
import type { IGetGoalByIdRepository } from '../../interfaces/repositories';

export class GetGoalByIdUseCase {
  private getGoalByIdRepository: IGetGoalByIdRepository;

  constructor(getGoalByIdRepository: IGetGoalByIdRepository) {
    this.getGoalByIdRepository = getGoalByIdRepository;
  }

  async execute(goalId: string, userId: string) {
    const goal = await this.getGoalByIdRepository.execute(goalId);

    if (!goal || goal.user_id !== userId) {
      throw new GoalNotFoundError(goalId);
    }

    return goal;
  }
}
