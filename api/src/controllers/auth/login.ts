import type { Request } from 'express';
import type { ILoginUseCase } from '../../interfaces/use-cases';
import { badRequest, ok, serverError, userNotFoundResponse } from '../helpers';
import { loginSchema } from '../../schemas';
import { ZodError } from 'zod';
import { InvalidPasswordError, UserNotFoundError } from '../../errors';

export class LoginController {
  private loginUseCase: ILoginUseCase;

  constructor(loginUseCase: ILoginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  async execute(request: Request) {
    try {
      const { email, password, rememberMe } = request.body;

      await loginSchema.parseAsync({ email, password, rememberMe });

      const user = await this.loginUseCase.execute(email, password, rememberMe);

      return ok(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0]?.message });
      }

      if (error instanceof InvalidPasswordError) {
        return badRequest({ message: error.message });
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }

      return serverError();
    }
  }
}
