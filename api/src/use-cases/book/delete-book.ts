import { BookNotFoundError } from '../../errors';
import type {
  IDeleteBookRepository,
  IGetBookByIdRepository,
} from '../../interfaces/repositories';

export class DeleteBookUseCase {
  private deleteBookRepository: IDeleteBookRepository;
  private getBookByIdRepository: IGetBookByIdRepository;

  constructor(
    deleteBookRepository: IDeleteBookRepository,
    getBookByIdRepository: IGetBookByIdRepository,
  ) {
    this.deleteBookRepository = deleteBookRepository;
    this.getBookByIdRepository = getBookByIdRepository;
  }

  async execute(bookId: string, userId: string): Promise<void> {
    const book = await this.getBookByIdRepository.execute(bookId);

    if (!book) {
      throw new BookNotFoundError(bookId);
    }

    if (book.user_id !== userId) {
      throw new BookNotFoundError(bookId);
    }

    return await this.deleteBookRepository.execute(bookId);
  }
}
