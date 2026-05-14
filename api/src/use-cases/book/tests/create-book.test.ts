import { faker } from '@faker-js/faker';
import { BookAlreadyExistsError, InvalidBookDatesError } from '../../../errors';
import { book } from '../../../tests';
import { CreateBookUseCase } from '../create-book';

describe('Create Book Use Case', () => {
  class CreateBookUseCaseStub {
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
    const createBookUseCase = new CreateBookUseCaseStub();
    const getBookByTitleRepository = new GetBookByTitleRepositoryStub();
    const sut = new CreateBookUseCase(
      createBookUseCase,
      getBookByTitleRepository,
    );

    return { sut, createBookUseCase, getBookByTitleRepository };
  };

  test('should create a book successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(book);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should already exist a book with the same title', async () => {
    const { sut, getBookByTitleRepository } = makeSut();
    vi.spyOn(getBookByTitleRepository, 'execute').mockResolvedValueOnce(
      book as any,
    );

    const promise = sut.execute(book);

    await expect(promise).rejects.toThrow(new BookAlreadyExistsError());
  });

  test('should start_date be less than end_date', async () => {
    const { sut } = makeSut();

    const promise = sut.execute({
      ...book,
      start_date: faker.date.future(),
      end_date: faker.date.past(),
    });

    await expect(promise).rejects.toThrow(new InvalidBookDatesError());
  });

  test('should throw if GetBookByTitleRepository throws', async () => {
    const { sut, getBookByTitleRepository } = makeSut();
    vi.spyOn(getBookByTitleRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(book);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if CreateBookUseCase throws', async () => {
    const { sut, createBookUseCase } = makeSut();
    vi.spyOn(createBookUseCase, 'execute').mockRejectedValueOnce(new Error());

    const promise = sut.execute(book);

    await expect(promise).rejects.toThrow();
  });
});
