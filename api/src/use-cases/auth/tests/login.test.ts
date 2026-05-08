import { user } from '../../../tests';
import { LoginUseCase } from '../login';
import { InvalidPasswordError, UserNotFoundError } from '../../../errors';

describe('Login Use Case', () => {
  class GetUserByEmailRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordComparatorAdapterStub {
    async execute() {
      return true;
    }
  }

  class TokensGeneratorAdapterStub {
    execute() {
      return {
        accessToken: 'any_access_token',
        refreshToken: 'any_refresh_token',
      };
    }
  }

  const makeSut = () => {
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub();
    const passwordComparatorAdapterStub = new PasswordComparatorAdapterStub();
    const tokensGeneratorAdapterStub = new TokensGeneratorAdapterStub();
    const sut = new LoginUseCase(
      getUserByEmailRepositoryStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    );

    return {
      sut,
      getUserByEmailRepositoryStub,
      passwordComparatorAdapterStub,
      tokensGeneratorAdapterStub,
    };
  };

  test('should throw UserNotFoundError if GetUserByEmailRepository returns null', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut();
    vi.spyOn(getUserByEmailRepositoryStub, 'execute').mockResolvedValueOnce(
      null as any,
    );

    const promise = sut.execute(user.email, user.password);

    await expect(promise).rejects.toThrow(new UserNotFoundError());
  });

  test('should throw InvalidPasswordError if PasswordComparatorAdapter returns false', async () => {
    const { sut, passwordComparatorAdapterStub } = makeSut();
    vi.spyOn(passwordComparatorAdapterStub, 'execute').mockResolvedValueOnce(
      false,
    );

    const promise = sut.execute(user.email, user.password);

    await expect(promise).rejects.toThrow(new InvalidPasswordError());
  });

  test('should return user with tokens', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.email, user.password);

    expect(result.tokens.accessToken).toBeDefined();
    expect(result.tokens.refreshToken).toBeDefined();
  });
});
