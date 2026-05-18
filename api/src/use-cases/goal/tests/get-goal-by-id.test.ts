import { faker } from '@faker-js/faker';
import { goal } from '../../../tests';
import { GetGoalByIdUseCase } from '../get-goal-by-id';
import { GoalNotFoundError } from '../../../errors';

describe('Get Goal By Id Use Case', () => {
  class GetGoalByIdRepositoryStub {
    async execute() {
      return goal;
    }
  }

  const makeSut = () => {
    const getGoalByIdRepository = new GetGoalByIdRepositoryStub();
    const sut = new GetGoalByIdUseCase(getGoalByIdRepository);

    return { sut, getGoalByIdRepository };
  };

  test('should get a goal successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(goal.id, goal.user_id);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should return GoalNotFoundError if goal is not found', async () => {
    const { sut, getGoalByIdRepository } = makeSut();
    vi.spyOn(getGoalByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const goalId = faker.string.uuid();

    const promise = sut.execute(goalId, goal.user_id);

    await expect(promise).rejects.toThrow(new GoalNotFoundError(goalId));
  });

  test('should throw if GetGoalByIdRepository throws', async () => {
    const { sut, getGoalByIdRepository } = makeSut();
    vi.spyOn(getGoalByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(goal.id, goal.user_id);

    await expect(promise).rejects.toThrow();
  });
});
