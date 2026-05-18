import type { IGoal } from '../../@types/IGoal';

export interface ICreateGoalRepository {
  execute(goal: IGoal): Promise<IGoal>;
}

export interface IGetGoalsRepository {
  execute(userId: string): Promise<IGoal[] | null>;
}
