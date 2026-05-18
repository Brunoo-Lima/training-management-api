import type { Request } from 'express';
import { goals } from '../../../tests';
import { faker } from '@faker-js/faker';
import { GetGoalsController } from '../get-goals';
import { UserNotFoundError } from '../../../errors';

describe('Get Goals Controller', () => {
  class GetGoalsUseCaseStub {
    async execute() {
      return goals;
    }
  }

  const makeSut = () => {
    const getGoalsUseCase = new GetGoalsUseCaseStub();
    const sut = new GetGoalsController(getGoalsUseCase);

    return {
      sut,
      getGoalsUseCase,
    };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  } as Partial<Request> as Request;

  test('should get goals successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(goals);
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

  test('should return 404 if user not found', async () => {
    const { sut, getGoalsUseCase } = makeSut();

    vi.spyOn(getGoalsUseCase, 'execute').mockRejectedValueOnce(
      new UserNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 500 if GetGoalsUseCase throws', async () => {
    const { sut, getGoalsUseCase } = makeSut();
    vi.spyOn(getGoalsUseCase, 'execute').mockRejectedValueOnce(new Error());

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });
});
