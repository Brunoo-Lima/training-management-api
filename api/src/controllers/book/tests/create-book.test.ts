import { faker } from '@faker-js/faker';
import { book } from '../../../tests';
import { CreateBookController } from '../create-book';
import type { Request } from 'express';
import { StatusReading } from '../../../../generated/prisma/enums';
import { BookAlreadyExistsError, InvalidBookDatesError } from '../../../errors';

describe('Create Book Controller', () => {
  class CreateBookUseCaseStub {
    async execute() {
      return book;
    }
  }

  const makeSut = () => {
    const createBookUseCaseStub = new CreateBookUseCaseStub();
    const sut = new CreateBookController(createBookUseCaseStub);

    return { createBookUseCaseStub, sut };
  };

  const baseHttpRequest = {
    body: {
      title: faker.book.title(),
      author: faker.person.fullName(),
      genre: ['Fiction', 'Mystery', 'Thriller'],
      status: StatusReading.WISHLIST,
      total_pages: faker.number.int(),
      start_date: '2026-04-04T01:28:00.523Z',
      user_id: faker.string.uuid(),
    },
  } as Partial<Request> as Request;

  test('should create a book successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(201);
    // expect(result.body).toEqual(book);
  });

  test('should return 400 if title is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        title: '',
        author: faker.person.fullName(),
        genre: ['Fiction', 'Mystery', 'Thriller'],
        status: StatusReading.WISHLIST,
        total_pages: faker.number.int(),
        start_date: '2026-04-04T01:28:00.523Z',
        user_id: faker.string.uuid(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if author is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        title: faker.book.title(),
        author: '',
        genre: ['Fiction', 'Mystery', 'Thriller'],
        status: StatusReading.WISHLIST,
        total_pages: faker.number.int(),
        start_date: '2026-04-04T01:28:00.523Z',
        user_id: faker.string.uuid(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if genre is invalid', async () => {
    const { sut } = makeSut();
    const request = {
      body: {
        title: faker.book.title(),
        author: faker.person.fullName(),
        genre: [],
        status: StatusReading.WISHLIST,
        total_pages: faker.number.int(),
        start_date: '2026-04-04T01:28:00.523Z',
        user_id: faker.string.uuid(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if status is invalid', async () => {
    const { sut } = makeSut();
    const request = {
      body: {
        title: faker.book.title(),
        author: faker.person.fullName(),
        genre: ['Fiction', 'Mystery', 'Thriller'],
        status: 'invalid_status',
        total_pages: faker.number.int(),
        start_date: '2026-04-04T01:28:00.523Z',
        user_id: faker.string.uuid(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if total_pages is invalid', async () => {
    const { sut } = makeSut();
    const request = {
      body: {
        title: faker.book.title(),
        author: faker.person.fullName(),
        genre: ['Fiction', 'Mystery', 'Thriller'],
        status: StatusReading.WISHLIST,
        total_pages: -1,
        start_date: '2026-04-04T01:28:00.523Z',
        user_id: faker.string.uuid(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if start_date is invalid', async () => {
    const { sut } = makeSut();
    const request = {
      body: {
        title: faker.book.title(),
        author: faker.person.fullName(),
        genre: ['Fiction', 'Mystery', 'Thriller'],
        status: StatusReading.WISHLIST,
        total_pages: faker.number.int(),
        start_date: 'invalid_date',
        user_id: faker.string.uuid(),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if user_id is invalid', async () => {
    const { sut } = makeSut();
    const request = {
      body: {
        title: faker.book.title(),
        author: faker.person.fullName(),
        genre: ['Fiction', 'Mystery', 'Thriller'],
        status: StatusReading.WISHLIST,
        total_pages: faker.number.int(),
        start_date: '2026-04-04T01:28:00.523Z',
        user_id: 123,
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if BookAlreadyExistsError throws', async () => {
    const { sut, createBookUseCaseStub } = makeSut();
    vi.spyOn(createBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new BookAlreadyExistsError(book.title),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if InvalidBookDatesError throws', async () => {
    const { sut, createBookUseCaseStub } = makeSut();
    vi.spyOn(createBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new InvalidBookDatesError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });

  test('should return 500 if CreateBookUseCase throws', async () => {
    const { sut, createBookUseCaseStub } = makeSut();
    vi.spyOn(createBookUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });
});
