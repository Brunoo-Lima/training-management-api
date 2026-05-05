import type { Request } from 'express';
import type { IUpdateBookUseCase } from '../../interfaces/use-cases';
import {
  badRequest,
  bookNotFoundResponse,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from '../helpers';
import {
  BookAlreadyExistsError,
  BookNotFoundError,
  InvalidBookDatesError,
} from '../../errors';
import { updateBookSchema } from '../../schemas';
import { ZodError } from 'zod';

export class UpdateBookController {
  private updateBookUseCase: IUpdateBookUseCase;

  constructor(updateBookUseCase: IUpdateBookUseCase) {
    this.updateBookUseCase = updateBookUseCase;
  }

  async execute(request: Request) {
    try {
      const bookId = request.params.id as string;
      const userId = request.params.userId as string;

      const isBookIdValid = checkIfIdIsValid(bookId);

      if (!isBookIdValid) {
        return invalidIdResponse();
      }

      const isUserIdValid = checkIfIdIsValid(userId);

      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      const bookData = request.body;

      await updateBookSchema.parseAsync(bookData);

      const updatedBook = await this.updateBookUseCase.execute(
        bookId,
        userId,
        bookData,
      );

      return ok(updatedBook);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0]?.message });
      }

      if (error instanceof BookNotFoundError) {
        return bookNotFoundResponse();
      }

      if (error instanceof BookAlreadyExistsError) {
        return badRequest({ message: error.message });
      }

      if (error instanceof InvalidBookDatesError) {
        return badRequest({ message: error.message });
      }

      console.log(error);
      return serverError();
    }
  }
}
