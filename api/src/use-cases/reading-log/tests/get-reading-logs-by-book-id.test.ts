import { faker } from '@faker-js/faker';
import { book, readingLogs, user } from '../../../tests';
import { GetReadingLogsByBookIdUseCase } from '../get-reading-logs-by-book-id';
import { BookNotFoundError, UserNotFoundError } from '../../../errors';

describe('Get Reading Logs By Book Id Use Case', () => {
  class GetReadingLogsByBookIdRepositoryStub {
    async execute() {
      return readingLogs;
    }
  }

  class GetBookIdRepositoryStub {
    async execute() {
      return book;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getReadingLogsByBookIdRepository =
      new GetReadingLogsByBookIdRepositoryStub();
    const getBookIdRepository = new GetBookIdRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetReadingLogsByBookIdUseCase(
      getReadingLogsByBookIdRepository,
      getBookIdRepository,
      getUserByIdRepository,
    );

    return {
      sut,
      getReadingLogsByBookIdRepository,
      getBookIdRepository,
      getUserByIdRepository,
    };
  };

  test('should get reading log by book id successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(book.id, user.id);

    expect(result).toEqual(readingLogs);
  });

  test('should return UserNotFoundError if user is not found', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(book.id, faker.string.uuid());

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  test('should reading log return empty if user has no reading log', async () => {
    const { sut, getReadingLogsByBookIdRepository } = makeSut();
    vi.spyOn(getReadingLogsByBookIdRepository, 'execute').mockResolvedValueOnce(
      [],
    );

    const result = await sut.execute(book.id, user.id);

    expect(result).toEqual([]);
  });

  test('should return BookNotFoundError if book is not found', async () => {
    const { sut, getBookIdRepository } = makeSut();
    vi.spyOn(getBookIdRepository, 'execute').mockResolvedValueOnce(null as any);

    const promise = sut.execute(faker.string.uuid(), user.id);

    await expect(promise).rejects.toThrow(new BookNotFoundError());
  });

  test('should throw if GetReadingLogsByBookIdRepository throws', async () => {
    const { sut, getReadingLogsByBookIdRepository } = makeSut();
    vi.spyOn(getReadingLogsByBookIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(book.id, user.id);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetBookIdRepository throws', async () => {
    const { sut, getBookIdRepository } = makeSut();
    vi.spyOn(getBookIdRepository, 'execute').mockRejectedValueOnce(new Error());

    const promise = sut.execute(book.id, user.id);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(book.id, user.id);

    await expect(promise).rejects.toThrow();
  });
});
