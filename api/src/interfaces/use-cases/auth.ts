import type { IAuth } from '../../@types/IAuth';

export interface ILoginUseCase {
  execute(email: string, password: string, rememberMe: boolean): Promise<IAuth>;
}

export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<IAuth>;
}
