import type { Request } from 'express';
import { RefreshTokenController } from '../refresh-token';
import { UnauthorizedError } from '../../../errors';

describe('Refresh Token Controller', () => {
  class RefreshTokenUseCaseStub {
    async execute() {
      return {
        accessToken: 'any_token',
        refreshToken: 'any_token',
      };
    }
  }

  const makeSut = () => {
    const refreshTokenUseCaseStub = new RefreshTokenUseCaseStub();
    const sut = new RefreshTokenController(refreshTokenUseCaseStub);

    return { refreshTokenUseCaseStub, sut };
  };

  const baseHttpRequest = {
    body: {
      refreshToken: 'any_token',
    },
  } as Partial<Request> as Request;

  test('should refresh token successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
  });

  test('should return 400 if refresh token is empty', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        refreshToken: '',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if refresh token is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        refreshToken: 123,
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 500 if RefreshTokenUseCase throws', async () => {
    const { sut, refreshTokenUseCaseStub } = makeSut();
    vi.spyOn(refreshTokenUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 401 if UnauthorizedError throws', async () => {
    const { sut, refreshTokenUseCaseStub } = makeSut();
    vi.spyOn(refreshTokenUseCaseStub, 'execute').mockRejectedValueOnce(
      new UnauthorizedError(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(401);
  });
});
