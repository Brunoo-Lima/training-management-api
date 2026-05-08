import type { Request } from 'express';
import type { IGetBookByIdUseCase } from '../../interfaces/use-cases';
import {
  bookNotFoundResponse,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from '../helpers';
import { BookNotFoundError } from '../../errors';

export class GetBookByIdController {
  private getBookByIdUseCase: IGetBookByIdUseCase;

  constructor(getBookByIdUseCase: IGetBookByIdUseCase) {
    this.getBookByIdUseCase = getBookByIdUseCase;
  }

  async execute(request: Request) {
    try {
      const bookId = request.params.bookId as string;
      const userId = request.params.userId as string;

      const isBookIdValid = checkIfIdIsValid(bookId);
      const isUserIdValid = checkIfIdIsValid(userId);

      if (!isBookIdValid || !isUserIdValid) {
        return invalidIdResponse();
      }

      const book = await this.getBookByIdUseCase.execute(bookId, userId);

      return ok(book);
    } catch (error) {
      if (error instanceof BookNotFoundError) {
        return bookNotFoundResponse();
      }

      return serverError();
    }
  }
}
