import { UserNotFoundError } from '../../../errors';
import { goal as fakeGoal, user } from '../../../tests';
import { CreateGoalUseCase } from '../create-goal';

describe('Create Goal Use Case', () => {
  const goal = {
    ...fakeGoal,
    id: undefined as any,
  };
  class CreateGoalRepositoryStub {
    async execute() {
      return goal;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'generated_id';
    }
  }

  const makeSut = () => {
    const createGoalRepository = new CreateGoalRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();

    const sut = new CreateGoalUseCase(
      createGoalRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    );

    return {
      sut,
      createGoalRepository,
      getUserByIdRepository,
      idGeneratorAdapter,
    };
  };

  test('should create a goal successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(goal);

    expect(result).toEqual(goal);
  });

  test('should UserNotFoundError if user is not found', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(goal);

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  test('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(goal);

    await expect(promise).rejects.toThrow();
  });

  test('should if IdGeneratorAdapter generates a random ID', async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    const idGeneratorAdapterSpy = vi.spyOn(idGeneratorAdapter, 'execute');

    await sut.execute(goal);

    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
  });

  test('should throw if IdGeneratorAdapter throws', async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    vi.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(goal);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if CreateGoalRepository throws', async () => {
    const { sut, createGoalRepository } = makeSut();
    vi.spyOn(createGoalRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(goal);

    await expect(promise).rejects.toThrow();
  });
});
