import { faker } from '@faker-js/faker';
import { user } from '../../../tests';
import { DeleteUserController } from '../delete-user';
import type { Request } from 'express';
import { UserNotFoundError } from '../../../errors';

describe('Delete User Controller', () => {
  class DeleteUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserUseCaseStub = new DeleteUserUseCaseStub();
    const sut = new DeleteUserController(deleteUserUseCaseStub);

    return { deleteUserUseCaseStub, sut };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  } as Partial<Request> as Request;

  test('should delete a user successfully', async () => {
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

  test('should return 404 if UserNotFoundError throws', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    vi.spyOn(deleteUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new UserNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 500 if DeleteUserUseCase throws', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    vi.spyOn(deleteUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });
});
