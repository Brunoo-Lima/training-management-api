import { EmailAlreadyInUseError } from '../../../errors';
import { user as fakeUser } from '../../../tests';
import { CreateUserUseCase } from '../create-user';

describe('Create User Use Case', () => {
  const user = {
    ...fakeUser,
    id: undefined as any,
  };

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class CreateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class PasswordHashAdapterStub {
    async execute() {
      return 'hashed_password';
    }
  }

  class IdGeneratorAdapterStub {
    execute() {
      return 'generated_id';
    }
  }

  const makeSut = () => {
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const createUserRepository = new CreateUserRepositoryStub();
    const passwordHashAdapter = new PasswordHashAdapterStub();
    const idGeneratorAdapter = new IdGeneratorAdapterStub();
    const sut = new CreateUserUseCase(
      getUserByEmailRepository,
      createUserRepository,
      idGeneratorAdapter,
      passwordHashAdapter,
    );

    return {
      sut,
      getUserByEmailRepository,
      createUserRepository,
      idGeneratorAdapter,
      passwordHashAdapter,
    };
  };

  test('should create a user successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
      user as any,
    );

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    );
  });

  test('should call IdGeneratorAdapter to generate a random ID', async () => {
    const { sut, idGeneratorAdapter, createUserRepository } = makeSut();
    const idGeneratorAdapterSpy = vi.spyOn(idGeneratorAdapter, 'execute');
    const createUserRepositorySpy = vi.spyOn(createUserRepository, 'execute');

    await sut.execute(user);

    expect(idGeneratorAdapterSpy).toHaveBeenCalled();
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    });
  });

  test('should call PasswordHashAdapter to hash the password', async () => {
    const { sut, createUserRepository, passwordHashAdapter } = makeSut();
    const createUserRepositorySpy = vi.spyOn(createUserRepository, 'execute');
    const passwordHashAdapterSpy = vi.spyOn(passwordHashAdapter, 'execute');

    await sut.execute(user);

    expect(passwordHashAdapterSpy).toHaveBeenCalledWith(user.password);
    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: 'hashed_password',
      id: 'generated_id',
    });
  });

  test('should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if PasswordHashAdapter throws', async () => {
    const { sut, passwordHashAdapter } = makeSut();
    vi.spyOn(passwordHashAdapter, 'execute').mockRejectedValueOnce(new Error());

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if IdGeneratorAdapter throws', async () => {
    const { sut, idGeneratorAdapter } = makeSut();
    vi.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepository } = makeSut();
    vi.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user);

    await expect(promise).rejects.toThrow();
  });
});
