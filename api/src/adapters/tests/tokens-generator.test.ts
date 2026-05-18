import jwt from 'jsonwebtoken';
import { TokensGeneratorAdapter } from '../tokens-generator';
import { REFRESH_TOKEN_EXPIRY_MS } from '../../utils/auth-session-expiry';

vi.mock('jsonwebtoken');

describe('TokensGeneratorAdapter', () => {
  let sut: TokensGeneratorAdapter;

  beforeEach(() => {
    sut = new TokensGeneratorAdapter();
    process.env.JWT_ACCESS_TOKEN_SECRET = 'access_secret';
    process.env.JWT_REFRESH_TOKEN_SECRET = 'refresh_secret';
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.JWT_ACCESS_TOKEN_SECRET;
    delete process.env.JWT_REFRESH_TOKEN_SECRET;
  });

  it('should call jwt.sign twice with correct params when rememberMe is false', () => {
    vi.spyOn(jwt, 'sign')
      .mockReturnValueOnce('access_token' as any)
      .mockReturnValueOnce('refresh_token' as any);

    sut.execute('any_user_id');

    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(jwt.sign).toHaveBeenNthCalledWith(
      1,
      { userId: 'any_user_id' },
      'access_secret',
      { expiresIn: '15m' },
    );
    expect(jwt.sign).toHaveBeenNthCalledWith(
      2,
      { userId: 'any_user_id' },
      'refresh_secret',
      { expiresIn: '7d' },
    );
  });

  it('should call jwt.sign with rememberMe expiry when rememberMe is true', () => {
    vi.spyOn(jwt, 'sign')
      .mockReturnValueOnce('access_token' as any)
      .mockReturnValueOnce('refresh_token' as any);

    sut.execute('any_user_id', true);

    expect(jwt.sign).toHaveBeenNthCalledWith(
      2,
      { userId: 'any_user_id' },
      'refresh_secret',
      { expiresIn: REFRESH_TOKEN_EXPIRY_MS / 1000 },
    );
  });

  it('should return accessToken and refreshToken', () => {
    vi.spyOn(jwt, 'sign')
      .mockReturnValueOnce('access_token' as any)
      .mockReturnValueOnce('refresh_token' as any);

    const result = sut.execute('any_user_id');

    expect(result).toEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
  });
});
