import type { Request } from 'express';
import type { IGetUserByIdUseCase } from '../../interfaces/use-cases';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';
import { UserNotFoundError } from '../../errors';

export class GetUserByIdController {
  private getUserByIdUseCase: IGetUserByIdUseCase;

  constructor(getUserByIdUseCase: IGetUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase;
  }

  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const user = await this.getUserByIdUseCase.execute(userId);

      return ok(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      console.log(error);
      return serverError();
    }
  }
}
