import type { IGoal } from '../../@types/IGoal';

export interface ICreateGoalUseCase {
  execute(goal: IGoal): Promise<IGoal>;
}
