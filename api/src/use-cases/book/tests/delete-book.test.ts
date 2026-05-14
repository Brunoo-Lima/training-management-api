import { faker } from '@faker-js/faker';
import { book } from '../../../tests';
import { DeleteBookUseCase } from '../delete-book';
import { BookNotFoundError } from '../../../errors';

describe('Delete Book Use Case', () => {
  class DeleteBookRepositoryStub {
    async execute() {
      return book;
    }
  }

  class GetBookByIdRepositoryStub {
    async execute() {
      return book;
    }
  }

  const makeSut = () => {
    const deleteBookRepository = new DeleteBookRepositoryStub();
    const getBookByIdRepository = new GetBookByIdRepositoryStub();
    const sut = new DeleteBookUseCase(
      deleteBookRepository,
      getBookByIdRepository,
    );

    return { sut, deleteBookRepository, getBookByIdRepository };
  };

  const baseHttpRequest = {
    params: {
      bookId: faker.string.uuid(),
      userId: faker.string.uuid(),
    },
  };

  test('should delete a book successfully', async () => {
    const { sut, getBookByIdRepository } = makeSut();

    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: baseHttpRequest.params.userId,
    } as any);

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

    const promise = sut.execute(
      baseHttpRequest.params.bookId,
      baseHttpRequest.params.userId,
    );

    await expect(promise).rejects.toThrow(
      new BookNotFoundError(baseHttpRequest.params.bookId),
    );
  });

  test('should throw BookNotFoundError if book does not belong to user', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: faker.string.uuid(),
    } as any);

    const promise = sut.execute(
      baseHttpRequest.params.bookId,
      baseHttpRequest.params.userId,
    );

    await expect(promise).rejects.toThrow(BookNotFoundError);
  });

  test('should throw if DeleteBookRepository throws', async () => {
    const { sut, deleteBookRepository } = makeSut();
    vi.spyOn(deleteBookRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(baseHttpRequest.params.bookId, book.user_id);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetBookByIdRepository throws', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(baseHttpRequest.params.bookId, book.user_id);

    await expect(promise).rejects.toThrow();
  });
});
