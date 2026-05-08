import { faker } from '@faker-js/faker';
import { book } from '../../../tests';
import { GetBookByIdController } from '../get-book-by-id';
import type { Request } from 'express';
import { BookNotFoundError } from '../../../errors';

describe('Get Book By ID Controller', () => {
  class GetBookByIdUseCaseStub {
    async execute() {
      return book;
    }
  }

  const makeSut = () => {
    const getBookByIdUseCaseStub = new GetBookByIdUseCaseStub();
    const sut = new GetBookByIdController(getBookByIdUseCaseStub);

    return { getBookByIdUseCaseStub, sut };
  };

  const baseHttpRequest = {
    params: {
      bookId: faker.string.uuid(),
      userId: faker.string.uuid(),
    },
  } as Partial<Request> as Request;

  test('should get a book by ID successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(book);
  });

  test('should return 400 if bookId is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        bookId: 'invalid_id',
        userId: faker.string.uuid(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if userId is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        bookId: faker.string.uuid(),
        userId: 'invalid_id',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 500 if GetBookByIdUseCase throws', async () => {
    const { sut, getBookByIdUseCaseStub } = makeSut();
    vi.spyOn(getBookByIdUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 404 if BookNotFoundError throws', async () => {
    const { sut, getBookByIdUseCaseStub } = makeSut();
    vi.spyOn(getBookByIdUseCaseStub, 'execute').mockRejectedValueOnce(
      new BookNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });
});
