import { faker } from '@faker-js/faker';
import { book } from '../../../tests';
import { UpdateBookController } from '../update-book';
import { StatusReading } from '../../../../generated/prisma/enums';
import type { Request } from 'express';
import {
  BookAlreadyExistsError,
  BookNotFoundError,
  InvalidBookDatesError,
} from '../../../errors';

describe('Update Book Controller', () => {
  class UpdateBookUseCaseStub {
    async execute() {
      return book;
    }
  }

  const makeSut = () => {
    const updateBookUseCaseStub = new UpdateBookUseCaseStub();
    const sut = new UpdateBookController(updateBookUseCaseStub);

    return { updateBookUseCaseStub, sut };
  };

  const baseHttpRequest = {
    params: {
      bookId: faker.string.uuid(),
      userId: faker.string.uuid(),
    },
    body: {
      title: faker.string.uuid(),
      author: faker.string.uuid(),
      genre: [faker.book.genre()],
      status: StatusReading.READING,
      total_pages: faker.number.int(),
      start_date: faker.date.anytime().toISOString(),
    },
  } as Partial<Request> as Request;

  test('should update a book successfully', async () => {
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
      body: {
        title: faker.string.uuid(),
        author: faker.string.uuid(),
        genre: [faker.book.genre()],
        status: StatusReading.READING,
        total_pages: faker.number.int(),
        start_date: faker.date.anytime(),
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
      body: {
        title: faker.string.uuid(),
        author: faker.string.uuid(),
        genre: [faker.book.genre()],
        status: StatusReading.READING,
        total_pages: faker.number.int(),
        start_date: faker.date.anytime(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if body is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        bookId: faker.string.uuid(),
        userId: faker.string.uuid(),
      },
      body: {
        ...baseHttpRequest.body,
        status: 'invalid_status',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should call UpdateBookUseCase with correct params', async () => {
    const { sut, updateBookUseCaseStub } = makeSut();
    const executeSpy = vi.spyOn(updateBookUseCaseStub, 'execute');

    await sut.execute(baseHttpRequest);

    expect(executeSpy).toHaveBeenCalledWith(
      baseHttpRequest.params.bookId,
      baseHttpRequest.params.userId,
      baseHttpRequest.body,
    );
  });

  test('should return 500 if UpdateBookUseCase throws', async () => {
    const { sut, updateBookUseCaseStub } = makeSut();
    vi.spyOn(updateBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 404 if BookNotFoundError throws', async () => {
    const { sut, updateBookUseCaseStub } = makeSut();
    vi.spyOn(updateBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new BookNotFoundError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(404);
  });

  test('should return 400 if BookAlreadyExistsError throws', async () => {
    const { sut, updateBookUseCaseStub } = makeSut();
    vi.spyOn(updateBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new BookAlreadyExistsError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if InvalidBookDatesError throws', async () => {
    const { sut, updateBookUseCaseStub } = makeSut();
    vi.spyOn(updateBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new InvalidBookDatesError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });
});
