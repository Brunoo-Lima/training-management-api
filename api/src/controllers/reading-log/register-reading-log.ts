import type { Request } from 'express';
import type { IRegisterReadingLogUseCase } from '../../interfaces/use-cases';
import {
  badRequest,
  bookNotFoundResponse,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';
import { BookNotFoundError, UserNotFoundError } from '../../errors';
import { ZodError } from 'zod';
import { registerReadingLogSchema } from '../../schemas';

export class RegisterReadingLogController {
  private registerReadingLogUseCase: IRegisterReadingLogUseCase;
  constructor(registerReadingLogUseCase: IRegisterReadingLogUseCase) {
    this.registerReadingLogUseCase = registerReadingLogUseCase;
  }

  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;
      const bookId = request.query.bookId as string;

      const isUserIdValid = checkIfIdIsValid(userId);

      if (!isUserIdValid) {
        return invalidIdResponse();
      }

      const isBookIdValid = checkIfIdIsValid(bookId);

      if (!isBookIdValid) {
        return invalidIdResponse();
      }

      const readingLogParams = request.body;

      await registerReadingLogSchema.parseAsync(readingLogParams);

      const registerReadingLog = await this.registerReadingLogUseCase.execute(
        readingLogParams,
        userId,
        bookId,
      );

      return ok(registerReadingLog);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0]?.message });
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      if (error instanceof BookNotFoundError) {
        return bookNotFoundResponse();
      }

      return serverError();
    }
  }
}
