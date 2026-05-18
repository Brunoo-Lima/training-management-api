import type { IGoal } from '../../@types/IGoal';

export interface ICreateGoalRepository {
  execute(goal: IGoal): Promise<IGoal>;
}

export interface IGetGoalsRepository {
  execute(userId: string): Promise<IGoal[] | null>;
}

export interface IGetGoalByIdRepository {
  execute(goalId: string): Promise<IGoal | null>;
}
