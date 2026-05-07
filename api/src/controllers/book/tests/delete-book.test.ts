import type { Request } from 'express';
import { book } from '../../../tests';
import { DeleteBookController } from '../delete-book';
import { faker } from '@faker-js/faker';
import { BookNotFoundError } from '../../../errors';

describe('Delete Book Controller', () => {
  class DeleteBookUseCaseStub {
    async execute() {
      return book;
    }
  }

  const makeSut = () => {
    const deleteBookUseCaseStub = new DeleteBookUseCaseStub();
    const sut = new DeleteBookController(deleteBookUseCaseStub);
    return { sut, deleteBookUseCaseStub };
  };

  const baseHttpRequest = {
    params: {
      bookId: faker.string.uuid(),
      userId: faker.string.uuid(),
    },
  } as Partial<Request> as Request;

  test('should delete a book successfully', async () => {
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

  test('should return 500 if DeleteBookUseCase throws', async () => {
    const { sut, deleteBookUseCaseStub } = makeSut();
    vi.spyOn(deleteBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 404 if BookNotFoundError throws', async () => {
    const { sut, deleteBookUseCaseStub } = makeSut();
    vi.spyOn(deleteBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new BookNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });
});
