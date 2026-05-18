import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../../../errors';
import { goals, user } from '../../../tests';
import { GetGoalsUseCase } from '../get-goals';

describe('Get Goals Use Case', () => {
  class GetGoalsRepositoryStub {
    async execute() {
      return goals;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getGoalsRepository = new GetGoalsRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetGoalsUseCase(getGoalsRepository, getUserByIdRepository);

    return { sut, getGoalsRepository, getUserByIdRepository };
  };

  test('should get goals successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toEqual(goals);
  });

  test('should return UserNotFoundError if user is not found', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  test('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetGoalsRepository throws', async () => {
    const { sut, getGoalsRepository } = makeSut();
    vi.spyOn(getGoalsRepository, 'execute').mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
