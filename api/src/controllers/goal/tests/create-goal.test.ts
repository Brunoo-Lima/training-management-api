import { faker } from '@faker-js/faker';
import { goal } from '../../../tests';
import { CreateGoalController } from '../create-goal';
import { GoalsType } from '../../../../generated/prisma/enums';
import type { Request } from 'express';
import { UserNotFoundError } from '../../../errors';

describe('Create Goal Controller', () => {
  class CreateGoalUseCaseStub {
    async execute() {
      return goal;
    }
  }

  const makeSut = () => {
    const createGoalUseCase = new CreateGoalUseCaseStub();
    const sut = new CreateGoalController(createGoalUseCase);

    return {
      sut,
      createGoalUseCase,
    };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      type: GoalsType.DAILY_PAGES,
      target_value: goal.target_value,
      start_date: goal.start_date.toISOString(),
    },
  } as Partial<Request> as Request;

  test('should return 201 if create a goal successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(goal);
  });

  test('should return 400 if user ID is invalid', async () => {
    const { sut } = makeSut();

    const userId = 'invalid_id';

    const request = {
      params: {
        userId,
      },
      ...baseHttpRequest.body,
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if type is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        userId: faker.string.uuid(),
      },
      body: {
        type: 'invalid_type',
        target_value: goal.target_value,
        start_date: goal.start_date.toISOString(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if target value is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        userId: faker.string.uuid(),
      },
      body: {
        type: GoalsType.DAILY_PAGES,
        target_value: -1,
        start_date: goal.start_date.toISOString(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if start date is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        userId: faker.string.uuid(),
      },
      body: {
        type: GoalsType.DAILY_PAGES,
        target_value: goal.target_value,
        start_date: 'invalid_date',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 500 if CreateGoalUseCase throws', async () => {
    const { sut, createGoalUseCase } = makeSut();
    vi.spyOn(createGoalUseCase, 'execute').mockRejectedValueOnce(new Error());

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 404 if UserNotFoundError throws', async () => {
    const { sut, createGoalUseCase } = makeSut();
    vi.spyOn(createGoalUseCase, 'execute').mockRejectedValueOnce(
      new UserNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });
});
