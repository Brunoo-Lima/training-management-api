import type { Request } from 'express';
import type { IRefreshTokenUseCase } from '../../interfaces/use-cases';
import { badRequest, ok, serverError, unauthorized } from '../helpers';
import { ZodError } from 'zod';
import { refreshTokenSchema } from '../../schemas';
import { UnauthorizedError } from '../../errors';

export class RefreshTokenController {
  private refreshTokenUseCase: IRefreshTokenUseCase;

  constructor(refreshTokenUseCase: IRefreshTokenUseCase) {
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  async execute(request: Request) {
    try {
      const { refreshToken } = request.body;

      await refreshTokenSchema.parseAsync({ refreshToken });

      const response = await this.refreshTokenUseCase.execute(refreshToken);

      return ok(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0]?.message });
      }

      if (error instanceof UnauthorizedError) {
        return unauthorized();
      }

      console.log(error);
      return serverError();
    }
  }
}
