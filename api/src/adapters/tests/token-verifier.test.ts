import jwt from 'jsonwebtoken';
import { TokenVerifierAdapter } from '../token-verifier';
import type { IDecodedToken } from '../../@types/IAuth';

vi.mock('jsonwebtoken');

describe('TokenVerifierAdapter', () => {
  let sut: TokenVerifierAdapter;

  beforeEach(() => {
    sut = new TokenVerifierAdapter();
  });

  it('should return the decoded token on success', () => {
    const decodedToken: IDecodedToken = { userId: 'any_id' };
    vi.spyOn(jwt, 'verify').mockReturnValueOnce(decodedToken as any);

    const result = sut.execute('any_token', 'any_secret');

    expect(result).toEqual(decodedToken);
  });
});
