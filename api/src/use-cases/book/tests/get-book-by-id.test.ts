import { faker } from '@faker-js/faker';
import { BookNotFoundError } from '../../../errors';
import { book } from '../../../tests';
import { GetBookByIdUseCase } from '../get-book-by-id';

describe('Get Book By Id Use Case', () => {
  class GetBookByIdRepositoryStub {
    async execute() {
      return book;
    }
  }

  const makeSut = () => {
    const getBookByIdRepository = new GetBookByIdRepositoryStub();
    const sut = new GetBookByIdUseCase(getBookByIdRepository);

    return { sut, getBookByIdRepository };
  };

  const baseHttpRequest = {
    params: {
      bookId: faker.string.uuid(),
      userId: faker.string.uuid(),
    },
  };

  test('should return a book', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: baseHttpRequest.params.userId,
    });

    const result = await sut.execute(
      baseHttpRequest.params.bookId,
      baseHttpRequest.params.userId,
    );

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should return BookNotFoundError if book is not found', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(book.id, baseHttpRequest.params.userId);

    await expect(promise).rejects.toThrow(BookNotFoundError);
  });

  test('should throw BookNotFoundError if book does not belong to user', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: faker.string.uuid(),
    });

    const promise = sut.execute(book.id, baseHttpRequest.params.userId);

    await expect(promise).rejects.toThrow(BookNotFoundError);
  });

  test('should throw if GetBookByIdRepository throws', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(
      baseHttpRequest.params.bookId,
      baseHttpRequest.params.userId,
    );

    await expect(promise).rejects.toThrow();
  });
});
