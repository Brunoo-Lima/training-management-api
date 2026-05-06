import type { Request } from 'express';
import type { IGetMyBooksUseCase } from '../../interfaces/use-cases';
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';
import {
  InvalidBookGenreError,
  InvalidBookStatusError,
  InvalidBookTitleError,
  UserNotFoundError,
} from '../../errors';
import type { StatusReading } from '../../../generated/prisma/enums';

export class GetMyBooksController {
  private getMyBooksUseCase: IGetMyBooksUseCase;

  constructor(getMyBooksUseCase: IGetMyBooksUseCase) {
    this.getMyBooksUseCase = getMyBooksUseCase;
  }

  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;
      const { search, genre, status } = request.query as {
        search?: string;
        genre?: string;
        status?: StatusReading;
      };

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const books = await this.getMyBooksUseCase.execute(
        userId,
        search,
        genre,
        status,
      );

      return ok(books);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      if (error instanceof InvalidBookStatusError) {
        return badRequest({ message: error.message });
      }

      if (error instanceof InvalidBookTitleError) {
        return badRequest({ message: error.message });
      }

      if (error instanceof InvalidBookGenreError) {
        return badRequest({ message: error.message });
      }

      console.log(error);
      return serverError();
    }
  }
}
