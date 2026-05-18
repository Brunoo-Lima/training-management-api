export class GoalNotFoundError extends Error {
  constructor(goalId?: string) {
    super(`Goal with id ${goalId ?? 'unknown'} not found`);
    this.name = 'GoalNotFoundError';
  }
}
