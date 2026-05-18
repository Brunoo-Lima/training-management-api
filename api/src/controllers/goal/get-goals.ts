import type { Request } from 'express';
import type { IGetGoalsUseCase } from '../../interfaces/use-cases';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';
import { UserNotFoundError } from '../../errors';

export class GetGoalsController {
  private getGoalsUseCase: IGetGoalsUseCase;
  constructor(getGoalsUseCase: IGetGoalsUseCase) {
    this.getGoalsUseCase = getGoalsUseCase;
  }
  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const goals = await this.getGoalsUseCase.execute(userId);

      return ok(goals);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}
