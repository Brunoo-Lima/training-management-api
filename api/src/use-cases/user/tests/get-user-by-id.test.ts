import { faker } from '@faker-js/faker';
import { UserNotFoundError } from '../../../errors';
import { user } from '../../../tests';
import { GetUserByIdUseCase } from '../get-user-by-id';

describe('Get User By Id Use Case', () => {
  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetUserByIdUseCase(getUserByIdRepository);

    return { sut, getUserByIdRepository };
  };

  test('should get a user successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
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
      new UserNotFoundError(),
    );

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow();
  });
});
