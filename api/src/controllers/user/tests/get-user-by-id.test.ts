import type { Request } from 'express';
import { GetUserByIdController } from '../get-user-by-id';
import { faker } from '@faker-js/faker';
import { user } from '../../../tests';
import { UserNotFoundError } from '../../../errors';

describe('Get User By ID Controller', () => {
  class GetUserByIdUseCaseStub {
    async execute() {
      return user;
    }
  }
  const makeSut = () => {
    const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub();
    const sut = new GetUserByIdController(getUserByIdUseCaseStub);

    return { getUserByIdUseCaseStub, sut };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  } as Partial<Request> as Request;

  test('should get a user by ID successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(user);
  });

  test('should return 400 if user ID is invalid', async () => {
    const { sut } = makeSut();

    const userId = 'invalid_id';

    const request = {
      params: {
        userId,
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 404 if user is not found', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut();
    vi.spyOn(getUserByIdUseCaseStub, 'execute').mockRejectedValue(
      new UserNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 500 if GetUserByIdUseCase throws', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut();
    vi.spyOn(getUserByIdUseCaseStub, 'execute').mockRejectedValue(new Error());

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });
});
