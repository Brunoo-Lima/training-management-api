import type { IGoal } from '../../@types/IGoal';

export interface ICreateGoalRepository {
  execute(goal: IGoal): Promise<void>;
}
