import type { Request } from 'express';
import type { IGetMyBooksUseCase } from '../../interfaces/use-cases';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';
import { UserNotFoundError } from '../../errors';

export class GetMyBooksController {
  private getMyBooksUseCase: IGetMyBooksUseCase;

  constructor(getMyBooksUseCase: IGetMyBooksUseCase) {
    this.getMyBooksUseCase = getMyBooksUseCase;
  }

  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const books = await this.getMyBooksUseCase.execute(userId);

      return ok(books);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      console.log(error);
      return serverError();
    }
  }
}
