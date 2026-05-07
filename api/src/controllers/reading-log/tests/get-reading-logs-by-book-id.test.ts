import type { Request } from 'express';
import { GetReadingLogsByBookIdController } from '../get-reading-logs-by-book-id';
import { faker } from '@faker-js/faker';
import { readingLogs } from '../../../tests';
import { BookNotFoundError, UserNotFoundError } from '../../../errors';

describe('Get Reading Logs By Book ID Controller', () => {
  class GetReadingLogsByBookIdUseCaseStub {
    async execute() {
      return readingLogs;
    }
  }

  const makeSut = () => {
    const getReadingLogsByBookIdUseCaseStub =
      new GetReadingLogsByBookIdUseCaseStub();
    const sut = new GetReadingLogsByBookIdController(
      getReadingLogsByBookIdUseCaseStub,
    );

    return { getReadingLogsByBookIdUseCaseStub, sut };
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

  test('should get reading logs by book ID successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(readingLogs);
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

  test('should return 404 if BookNotFoundError throws', async () => {
    const { sut, getReadingLogsByBookIdUseCaseStub } = makeSut();
    vi.spyOn(
      getReadingLogsByBookIdUseCaseStub,
      'execute',
    ).mockRejectedValueOnce(new BookNotFoundError());

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 404 if UserNotFoundError throws', async () => {
    const { sut, getReadingLogsByBookIdUseCaseStub } = makeSut();
    vi.spyOn(
      getReadingLogsByBookIdUseCaseStub,
      'execute',
    ).mockRejectedValueOnce(new UserNotFoundError());

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 500 if GetReadingLogsByBookIdUseCase throws', async () => {
    const { sut, getReadingLogsByBookIdUseCaseStub } = makeSut();
    vi.spyOn(
      getReadingLogsByBookIdUseCaseStub,
      'execute',
    ).mockRejectedValueOnce(new Error());

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });
});
