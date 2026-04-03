import type { Request } from 'express';
import type { ICreateUserUseCase } from '../../interfaces/use-cases/user';
import { badRequest, created, serverError } from '../helpers';
import { EmailAlreadyInUseError } from '../../errors';
import { createUserSchema } from '../../schemas';
import { ZodError } from 'zod';

export class CreateUserController {
  private createUserUseCase: ICreateUserUseCase;
  constructor(createUserUseCase: ICreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(req: Request) {
    try {
      const params = req.body;

      await createUserSchema.parseAsync(params);

      const user = await this.createUserUseCase.execute(params);

      return created(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0]?.message });
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }

      console.error(error);
      return serverError();
    }
  }
}
