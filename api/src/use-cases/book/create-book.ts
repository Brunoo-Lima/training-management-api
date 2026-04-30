import type { IBook } from '../../@types/IBook';
import { BookAlreadyExistsError, InvalidBookDatesError } from '../../errors';
import type {
  ICreateBookRepository,
  IGetBookByTitleRepository,
} from '../../interfaces/repositories';

export class CreateBookUseCase {
  private createBookRepository: ICreateBookRepository;
  private getBookByTitleRepository: IGetBookByTitleRepository;

  constructor(
    createBookRepository: ICreateBookRepository,
    getBookByTitleRepository: IGetBookByTitleRepository,
  ) {
    this.createBookRepository = createBookRepository;
    this.getBookByTitleRepository = getBookByTitleRepository;
  }

  async execute(book: IBook) {
    const bookAlreadyExists = await this.getBookByTitleRepository.execute(
      book.title,
    );

    if (bookAlreadyExists) {
      throw new BookAlreadyExistsError();
    }

    if (book.start_date && book.end_date && book.end_date < book.start_date) {
      throw new InvalidBookDatesError();
    }

    return await this.createBookRepository.execute(book);
  }
}
