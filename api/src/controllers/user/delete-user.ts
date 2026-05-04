import type { Request } from 'express';
import type { IDeleteUserUseCase } from '../../interfaces/use-cases';
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from '../helpers';
import { UserNotFoundError } from '../../errors';

export class DeleteUserController {
  private deleteUserUseCase: IDeleteUserUseCase;

  constructor(deleteUserUseCase: IDeleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const user = await this.deleteUserUseCase.execute(userId as string);

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
