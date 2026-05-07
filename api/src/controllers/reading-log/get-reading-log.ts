import type { Request } from 'express';
import type { IGetReadingLogUseCase } from '../../interfaces/use-cases';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';
import { UserNotFoundError } from '../../errors';

export class GetReadingLogController {
  private getReadingLogUseCase: IGetReadingLogUseCase;

  constructor(getReadingLogUseCase: IGetReadingLogUseCase) {
    this.getReadingLogUseCase = getReadingLogUseCase;
  }

  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const readingLog = await this.getReadingLogUseCase.execute(userId);

      return ok(readingLog);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}
