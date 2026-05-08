import type { Request } from 'express';
import { books } from '../../../tests';
import { GetMyBooksController } from '../get-my-books';
import { faker } from '@faker-js/faker';
import {
  InvalidBookGenreError,
  InvalidBookStatusError,
  InvalidBookTitleError,
  UserNotFoundError,
} from '../../../errors';

describe('Get my books controller', () => {
  class GetMyBooksUseCaseStub {
    async execute() {
      return books;
    }
  }

  const makeSut = () => {
    const getMyBooksUseCaseStub = new GetMyBooksUseCaseStub();
    const sut = new GetMyBooksController(getMyBooksUseCaseStub);

    return { getMyBooksUseCaseStub, sut };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },

    query: {
      genre: faker.book.genre(),
    },
  } as Partial<Request> as Request;

  test('should get my books successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(books);
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

  test('should return 500 if GetMyBooksUseCase throws', async () => {
    const { sut, getMyBooksUseCaseStub } = makeSut();
    vi.spyOn(getMyBooksUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 400 if InvalidBookStatusError throws', async () => {
    const { sut, getMyBooksUseCaseStub } = makeSut();
    vi.spyOn(getMyBooksUseCaseStub, 'execute').mockRejectedValueOnce(
      new InvalidBookStatusError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if InvalidBookGenreError throws', async () => {
    const { sut, getMyBooksUseCaseStub } = makeSut();
    vi.spyOn(getMyBooksUseCaseStub, 'execute').mockRejectedValueOnce(
      new InvalidBookGenreError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if InvalidBookTitleError throws', async () => {
    const { sut, getMyBooksUseCaseStub } = makeSut();
    vi.spyOn(getMyBooksUseCaseStub, 'execute').mockRejectedValueOnce(
      new InvalidBookTitleError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('should return 404 if UserNotFoundError throws', async () => {
    const { sut, getMyBooksUseCaseStub } = makeSut();
    vi.spyOn(getMyBooksUseCaseStub, 'execute').mockRejectedValueOnce(
      new UserNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });
});
