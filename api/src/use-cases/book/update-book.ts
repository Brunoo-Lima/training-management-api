import type { IUpdateBook } from '../../@types/IBook';
import {
  BookAlreadyExistsError,
  BookNotFoundError,
  InvalidBookDatesError,
} from '../../errors';
import type {
  IGetBookByIdRepository,
  IGetBookByTitleRepository,
  IUpdateBookRepository,
} from '../../interfaces/repositories';

export class UpdateBookUseCase {
  private updateBookRepository: IUpdateBookRepository;
  private getBookByIdRepository: IGetBookByIdRepository;
  private getBookByTitleRepository: IGetBookByTitleRepository;

  constructor(
    updateBookRepository: IUpdateBookRepository,
    getBookByIdRepository: IGetBookByIdRepository,
    getBookByTitleRepository: IGetBookByTitleRepository,
  ) {
    this.updateBookRepository = updateBookRepository;
    this.getBookByIdRepository = getBookByIdRepository;
    this.getBookByTitleRepository = getBookByTitleRepository;
  }

  async execute(bookId: string, userId: string, book: IUpdateBook) {
    const bookAlreadyExists = await this.getBookByIdRepository.execute(bookId);

    if (!bookAlreadyExists) {
      throw new BookNotFoundError();
    }

    if (bookAlreadyExists.user_id !== userId) {
      throw new BookNotFoundError();
    }

    if (book.title && book.title.trim()) {
      const bookWithSameTitle = await this.getBookByTitleRepository.execute(
        book.title,
      );

      if (bookWithSameTitle && bookWithSameTitle.id !== bookId) {
        throw new BookAlreadyExistsError(
          'Already exists a book with the provided title',
        );
      }
    }

    if (book.start_date && book.end_date && book.end_date < book.start_date) {
      throw new InvalidBookDatesError();
    }

    const updatedBook = await this.updateBookRepository.execute(bookId, book);

    return updatedBook;
  }
}
