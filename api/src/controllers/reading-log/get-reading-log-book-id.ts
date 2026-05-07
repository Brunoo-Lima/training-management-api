import type { Request } from 'express';
import { BookNotFoundError, UserNotFoundError } from '../../errors';
import type { IGetReadingLogBookIdUseCase } from '../../interfaces/use-cases';
import {
  bookNotFoundResponse,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';

export class GetReadingLogBookIdController {
  private getReadingLogBookIdUseCase: IGetReadingLogBookIdUseCase;

  constructor(getReadingLogBookIdUseCase: IGetReadingLogBookIdUseCase) {
    this.getReadingLogBookIdUseCase = getReadingLogBookIdUseCase;
  }

  async execute(request: Request) {
    try {
      const bookId = request.query.bookId as string;
      const userId = request.params.userId as string;

      const isBookIdValid = checkIfIdIsValid(bookId);

      if (!isBookIdValid) {
        return invalidIdResponse();
      }

      const isUserIdValid = checkIfIdIsValid(userId);

      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      const readingLog = await this.getReadingLogBookIdUseCase.execute(
        bookId,
        userId,
      );

      return ok(readingLog);
    } catch (error) {
      if (error instanceof BookNotFoundError) {
        return bookNotFoundResponse();
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      console.log(error);
      return serverError();
    }
  }
}
