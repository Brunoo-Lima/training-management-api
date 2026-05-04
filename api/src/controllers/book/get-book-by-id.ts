import type { Request } from 'express';
import type { IGetBookByIdUseCase } from '../../interfaces/use-cases';
import {
  badRequest,
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
      const id = request.params.id as string;

      const isIdValid = checkIfIdIsValid(id);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const book = await this.getBookByIdUseCase.execute(id);
      return ok(book);
    } catch (error) {
      if (error instanceof BookNotFoundError) {
        return badRequest({ message: error.message });
      }

      console.log(error);
      return serverError();
    }
  }
}
