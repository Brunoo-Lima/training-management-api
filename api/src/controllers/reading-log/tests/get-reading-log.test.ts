import { faker } from '@faker-js/faker';
import { readingLogs } from '../../../tests';
import { GetReadingLogController } from '../get-reading-log';
import type { Request } from 'express';
import { UserNotFoundError } from '../../../errors';

describe('Get Reading Log Controller', () => {
  class GetReadingLogUseCaseStub {
    async execute() {
      return readingLogs;
    }
  }

  const makeSut = () => {
    const getReadingLogUseCaseStub = new GetReadingLogUseCaseStub();
    const sut = new GetReadingLogController(getReadingLogUseCaseStub);

    return { getReadingLogUseCaseStub, sut };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  } as Partial<Request> as Request;

  test('should get a reading log successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(readingLogs);
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
    const { sut, getReadingLogUseCaseStub } = makeSut();
    vi.spyOn(getReadingLogUseCaseStub, 'execute').mockRejectedValueOnce(
      new UserNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 500 if GetReadingLogUseCase throws', async () => {
    const { sut, getReadingLogUseCaseStub } = makeSut();
    vi.spyOn(getReadingLogUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });
});
