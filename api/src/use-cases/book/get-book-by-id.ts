import { BookNotFoundError } from '../../errors';
import type { IGetBookByIdRepository } from '../../interfaces/repositories';

export class GetBookByIdUseCase {
  private getBookByIdRepository: IGetBookByIdRepository;

  constructor(getBookByIdRepository: IGetBookByIdRepository) {
    this.getBookByIdRepository = getBookByIdRepository;
  }

  async execute(bookId: string, userId: string) {
    const book = await this.getBookByIdRepository.execute(bookId);

    if (!book || book.user_id !== userId) {
      throw new BookNotFoundError();
    }

    return book;
  }
}
