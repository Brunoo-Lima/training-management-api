import type { Request } from 'express';
import type { IDeleteBookUseCase } from '../../interfaces/use-cases';
import { bookNotFoundResponse, ok, serverError } from '../helpers';
import { BookNotFoundError } from '../../errors';

export class DeleteBookController {
  private deleteBookUseCase: IDeleteBookUseCase;

  constructor(deleteBookUseCase: IDeleteBookUseCase) {
    this.deleteBookUseCase = deleteBookUseCase;
  }

  async execute(request: Request) {
    try {
      const bookId = request.params.id as string;
      const userId = request.userId as string;

      const book = await this.deleteBookUseCase.execute(bookId, userId);

      return ok(book);
    } catch (error) {
      if (error instanceof BookNotFoundError) {
        return bookNotFoundResponse();
      }

      return serverError();
    }
  }
}
