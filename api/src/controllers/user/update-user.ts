import type { Request } from 'express';
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from '../helpers';
import { ZodError } from 'zod';
import { EmailAlreadyInUseError } from '../../errors';
import { updateUserSchema } from '../../schemas';
import type { IUpdateUserUseCase } from '../../interfaces/use-cases';

export class UpdateUserController {
  private updateUserUseCase: IUpdateUserUseCase;

  constructor(updateUserUseCase: IUpdateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase;
  }

  async execute(request: Request) {
    try {
      const userId = request.params.userId as string;

      const isIdValid = checkIfIdIsValid(userId);

      if (!isIdValid) {
        return invalidIdResponse();
      }

      const updateUserParams = request.body;

      await updateUserSchema.parseAsync(updateUserParams);

      const updateUser = await this.updateUserUseCase.execute(
        userId,
        updateUserParams,
      );

      return ok(updateUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0]?.message });
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      return serverError();
    }
  }
}
