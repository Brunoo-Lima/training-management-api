import jwt from 'jsonwebtoken';
import type { IDecodedToken } from '../@types/IAuth';

export class TokenVerifierAdapter {
  execute(token: string, secret: string): IDecodedToken {
    return jwt.verify(token, secret) as IDecodedToken;
  }
}
