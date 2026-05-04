import type { JwtPayload } from 'jsonwebtoken';
import type { IUserSafe } from './IUser';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export type IAuth = IUserSafe & {
  tokens: ITokens;
};

export type IDecodedToken = JwtPayload & {
  userId: string;
};
