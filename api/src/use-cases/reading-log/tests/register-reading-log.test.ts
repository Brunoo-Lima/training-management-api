import { faker } from '@faker-js/faker';
import type { IReadingLog } from '../../../@types/IReadingLog';
import { BookNotFoundError, UserNotFoundError } from '../../../errors';
import { book, readingLog as fakerReadingLog, user } from '../../../tests';
import { RegisterReadingLogUseCase } from '../register-reading-log';

describe('Register Reading Log Use Case', () => {
  const readingLog: IReadingLog = {
    ...fakerReadingLog,
    id: undefined as any,
    user_id: user.id,
    book_id: book.id,
  };

  class RegisterReadingLogRepositoryStub {
    async execute() {
      return readingLog;
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  class GetBookByIdRepositoryStub {
    async execute() {
      return book;
    }
  }

  const makeSut = () => {
    const registerReadingLogRepository = new RegisterReadingLogRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const getBookByIdRepository = new GetBookByIdRepositoryStub();
    const sut = new RegisterReadingLogUseCase(
      registerReadingLogRepository,
      getUserByIdRepository,
      getBookByIdRepository,
    );

    return {
      sut,
      registerReadingLogRepository,
      getUserByIdRepository,
      getBookByIdRepository,
    };
  };

  test('should register reading log successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(readingLog, user.id, book.id);

    expect(result).toEqual(readingLog);
  });

  test('should return UserNotFoundError if user is not found', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(readingLog, faker.string.uuid(), book.id);

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  test('should return BookNotFoundError if book is not found', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(readingLog, user.id, faker.string.uuid());

    await expect(promise).rejects.toThrow(new BookNotFoundError());
  });

  test('should throw if RegisterReadingLogRepository throws', async () => {
    const { sut, registerReadingLogRepository } = makeSut();
    vi.spyOn(registerReadingLogRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(readingLog, user.id, book.id);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(readingLog, user.id, book.id);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetBookByIdRepository throws', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(readingLog, user.id, book.id);

    await expect(promise).rejects.toThrow();
  });
});
