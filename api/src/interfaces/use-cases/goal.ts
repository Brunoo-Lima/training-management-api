import type { IGoal } from '../../@types/IGoal';

export interface ICreateGoalUseCase {
  execute(goal: IGoal): Promise<IGoal>;
}

export interface IGetGoalsUseCase {
  execute(userId: string): Promise<IGoal[] | null>;
}

export interface IGetGoalByIdUseCase {
  execute(goalId: string): Promise<IGoal | null>;
}
