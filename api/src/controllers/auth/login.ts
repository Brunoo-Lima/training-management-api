import type { Request } from 'express';
import type { ILoginUseCase } from '../../interfaces/use-cases';
import { badRequest, ok, serverError } from '../helpers';
import { loginSchema } from '../../schemas';
import { ZodError } from 'zod';

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

      console.log(error);
      return serverError();
    }
  }
}
