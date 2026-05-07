import type { Request } from 'express';
import { RegisterReadingLogController } from '../register-reading-log';
import { readingLog } from '../../../tests';
import { faker } from '@faker-js/faker';
import { BookNotFoundError, UserNotFoundError } from '../../../errors';

describe('Register Reading Log Controller', () => {
  class RegisterReadingLogUseCaseStub {
    async execute() {
      return readingLog;
    }
  }

  const makeSut = () => {
    const registerReadingLogUseCaseStub = new RegisterReadingLogUseCaseStub();
    const sut = new RegisterReadingLogController(registerReadingLogUseCaseStub);

    return { registerReadingLogUseCaseStub, sut };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    query: {
      bookId: faker.string.uuid(),
    },
    body: {
      pages_read: faker.number.int(),
      notes_about_session: faker.lorem.sentence(),
      date: '2026-04-04T01:28:00.523Z',
    },
  } as Partial<Request> as Request;

  test('should register a reading log successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(readingLog);
  });

  test('should return 400 if book ID is invalid', async () => {
    const { sut } = makeSut();

    const bookId = 'invalid_id';

    const request = {
      params: {
        userId: faker.string.uuid(),
      },
      query: {
        bookId,
      },
      body: {
        pages_read: faker.number.int(),
        notes_about_session: faker.lorem.sentence(),
        date: '2026-04-04T01:28:00.523Z',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if user ID is invalid', async () => {
    const { sut } = makeSut();

    const userId = 'invalid_id';

    const request = {
      params: {
        userId,
      },
      query: {
        bookId: faker.string.uuid(),
      },
      body: {
        pages_read: faker.number.int(),
        notes_about_session: faker.lorem.sentence(),
        date: '2026-04-04T01:28:00.523Z',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if reading log pages read is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        userId: faker.string.uuid(),
      },
      query: {
        bookId: faker.string.uuid(),
      },
      body: {
        pages_read: -1,
        notes_about_session: faker.lorem.sentence(),
        date: '2026-04-04T01:28:00.523Z',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if date is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        userId: faker.string.uuid(),
      },
      query: {
        bookId: faker.string.uuid(),
      },
      body: {
        pages_read: faker.number.int(),
        notes_about_session: faker.lorem.sentence(),
        date: 'invalid_date',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 500 if RegisterReadingLogUseCase throws', async () => {
    const { sut, registerReadingLogUseCaseStub } = makeSut();
    vi.spyOn(registerReadingLogUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 404 if UserNotFoundError throws', async () => {
    const { sut, registerReadingLogUseCaseStub } = makeSut();
    vi.spyOn(registerReadingLogUseCaseStub, 'execute').mockRejectedValueOnce(
      new UserNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 404 if BookNotFoundError throws', async () => {
    const { sut, registerReadingLogUseCaseStub } = makeSut();
    vi.spyOn(registerReadingLogUseCaseStub, 'execute').mockRejectedValueOnce(
      new BookNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });
});
