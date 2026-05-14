import { faker } from '@faker-js/faker';
import { books, user } from '../../../tests';
import { GetMyBooksUseCase } from '../get-my-books';
import {
  InvalidBookGenreError,
  InvalidBookStatusError,
  InvalidBookTitleError,
  UserNotFoundError,
} from '../../../errors';

describe('Get My Books Use Case', () => {
  class GetMyBooksRepositoryStub {
    async execute() {
      return [];
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const getMyBooksRepository = new GetMyBooksRepositoryStub();
    const getUserByIdRepository = new GetUserByIdRepositoryStub();
    const sut = new GetMyBooksUseCase(
      getMyBooksRepository,
      getUserByIdRepository,
    );

    return { sut, getMyBooksRepository, getUserByIdRepository };
  };

  test('should get my books successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should return InvalidBookStatusError if book status is invalid', async () => {
    const { sut, getMyBooksRepository, getUserByIdRepository } = makeSut();

    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce({
      ...user,
      id: 'user-id',
    } as any);

    vi.spyOn(getMyBooksRepository, 'execute').mockResolvedValueOnce(
      books as any,
    );

    const promise = sut.execute(
      'user-id',
      undefined,
      undefined,
      'INVALID_STATUS' as any,
    );

    await expect(promise).rejects.toThrow(
      new InvalidBookStatusError('INVALID_STATUS'),
    );
  });

  test('should return InvaliBookTitleError if book title is invalid', async () => {
    const { sut, getMyBooksRepository, getUserByIdRepository } = makeSut();

    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce({
      ...user,
      id: 'user-id',
    } as any);

    vi.spyOn(getMyBooksRepository, 'execute').mockResolvedValueOnce(
      books as any,
    );

    const promise = sut.execute('user-id', 123 as any, undefined, undefined);

    await expect(promise).rejects.toThrow(
      new InvalidBookTitleError('Search must be a string'),
    );
  });

  test('should return UserNotFoundError if user is not found', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(faker.string.uuid());

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  test('should return InvalidBookGenreError if genre is invalid', async () => {
    const { sut, getMyBooksRepository, getUserByIdRepository } = makeSut();

    vi.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce({
      ...user,
      id: 'user-id',
    } as any);

    vi.spyOn(getMyBooksRepository, 'execute').mockResolvedValueOnce(
      books as any,
    );

    const promise = sut.execute('user-id', undefined, 123 as any, undefined);

    await expect(promise).rejects.toThrow(new InvalidBookGenreError('123'));
  });

  test('should throw if GetMyBooksRepository throws', async () => {
    const { sut, getMyBooksRepository } = makeSut();
    vi.spyOn(getMyBooksRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepository } = makeSut();
    vi.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
