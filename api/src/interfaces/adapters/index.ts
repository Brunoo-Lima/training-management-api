import type { IDecodedToken, ITokens } from '../../@types/IAuth';

export interface IIdGeneratorAdapter {
  execute(): string;
}

export interface IPasswordHashAdapter {
  execute(password: string): Promise<string>;
}

export interface IPasswordComparatorAdapter {
  execute(password: string, hashedPassword: string): Promise<boolean>;
}

export interface ITokensGeneratorAdapter {
  execute(userId: string, rememberMe?: boolean): ITokens;
}

export interface ITokenVerifierAdapter {
  execute(token: string, secret: string): IDecodedToken;
}
