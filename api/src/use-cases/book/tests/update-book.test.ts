import { faker } from '@faker-js/faker';
import { book, user } from '../../../tests';
import { UpdateBookUseCase } from '../update-book';
import {
  BookAlreadyExistsError,
  BookNotFoundError,
  InvalidBookDatesError,
} from '../../../errors';

describe('Update Book Use Case', () => {
  class UpdateBookRepositoryStub {
    async execute() {
      return book;
    }
  }

  class GetBookByIdRepositoryStub {
    async execute() {
      return book;
    }
  }

  class GetBookByTitleRepositoryStub {
    async execute() {
      return null;
    }
  }

  const makeSut = () => {
    const updateBookRepository = new UpdateBookRepositoryStub();
    const getBookByIdRepository = new GetBookByIdRepositoryStub();
    const getBookByTitleRepository = new GetBookByTitleRepositoryStub();
    const sut = new UpdateBookUseCase(
      updateBookRepository,
      getBookByIdRepository,
      getBookByTitleRepository,
    );
    return {
      sut,
      updateBookRepository,
      getBookByIdRepository,
      getBookByTitleRepository,
    };
  };

  test('should update a book successfully', async () => {
    const { sut, getBookByIdRepository } = makeSut();

    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: user.id,
    });

    const result = await sut.execute(book.id, user.id, book);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should return BookNotFoundError if book is not found', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(faker.string.uuid(), user.id, book);

    await expect(promise).rejects.toThrow(new BookNotFoundError());
  });

  test('should return BookNotFoundError if user is not book owner', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: faker.string.uuid(),
    });

    const promise = sut.execute(book.id, user.id, book);

    await expect(promise).rejects.toThrow(new BookNotFoundError());
  });

  test('should return title error if title is not provided', async () => {
    const { sut, getBookByTitleRepository, getBookByIdRepository } = makeSut();

    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: book.user_id,
    });

    const getBookByTitleRepositorySpy = vi.spyOn(
      getBookByTitleRepository,
      'execute',
    );

    await sut.execute(book.id, book.user_id, {
      ...book,
      title: ' ',
    });

    expect(getBookByTitleRepositorySpy).not.toHaveBeenCalled();
  });

  test('should return BookAlreadyExistsError if book title already exists', async () => {
    const { sut, getBookByIdRepository, getBookByTitleRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      id: '123',
      user_id: user.id,
    });
    vi.spyOn(getBookByTitleRepository, 'execute').mockResolvedValueOnce({
      ...book,
      id: '123',
      user_id: user.id,
      title: 'Some Title',
    } as any);

    const promise = sut.execute(book.id, user.id, {
      ...book,
      title: 'Some Title',
    });

    await expect(promise).rejects.toThrow(
      new BookAlreadyExistsError(
        'Already exists a book with the provided title',
      ),
    );
  });

  test('should return InvalidBookDatesError if start_date is greater than end_date', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockResolvedValueOnce({
      ...book,
      user_id: user.id,
    });

    const promise = sut.execute(book.id, user.id, {
      ...book,
      start_date: faker.date.future(),
      end_date: faker.date.past(),
    });

    await expect(promise).rejects.toThrow(new InvalidBookDatesError());
  });

  test('should throw if GetBookByIdRepository throws', async () => {
    const { sut, getBookByIdRepository } = makeSut();
    vi.spyOn(getBookByIdRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(book.id, user.id, book);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetBookByTitleRepository throws', async () => {
    const { sut, getBookByTitleRepository } = makeSut();
    vi.spyOn(getBookByTitleRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(book.id, user.id, book);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if UpdateBookRepository throws', async () => {
    const { sut, updateBookRepository } = makeSut();
    vi.spyOn(updateBookRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(book.id, user.id, book);

    await expect(promise).rejects.toThrow();
  });
});
