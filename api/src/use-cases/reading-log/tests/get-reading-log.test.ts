import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../../../errors';
import { readingLogs, user } from '../../../tests';
import { GetReadingLogUseCase } from '../get-reading-log';

describe('Get Reading Log Use Case', () => {
  class GetReadingLogRepositoryStub {
    async execute() {
      return readingLogs;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getReadingLogRepository = new GetReadingLogRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetReadingLogUseCase(
      getReadingLogRepository,
      getUserByIdRepository,
    );

    return { sut, getReadingLogRepository, getUserByIdRepository };
  };

  test('should get reading log successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toEqual(readingLogs);
  });

  test('should return UserNotFoundError if user is not found', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  test('should readingLog return empty if user has no reading log', async () => {
    const { sut, getReadingLogRepository } = makeSut();
    vi.spyOn(getReadingLogRepository, 'execute').mockResolvedValueOnce([]);

    const result = await sut.execute(user.id);

    expect(result).toEqual([]);
  });

  test('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
      new UserNotFoundError(),
    );

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetReadingLogRepository throws', async () => {
    const { sut, getReadingLogRepository } = makeSut();
    vi.spyOn(getReadingLogRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
