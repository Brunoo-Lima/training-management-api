import { faker } from '@faker-js/faker';
import { user } from '../../../tests';
import { UpdateUserUseCase } from '../update-user';
import type { Request } from 'express';
import { EmailAlreadyInUseError } from '../../../errors';

describe('Update User Use Case', () => {
  class UpdateUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null;
    }
  }

  class PasswordHashAdapterStub {
    async execute() {
      return 'hashed_password';
    }
  }

  const makeSut = () => {
    const updateUserRepository = new UpdateUserRepositoryStub();
    const getUserByEmailRepository = new GetUserByEmailRepositoryStub();
    const passwordHashAdapter = new PasswordHashAdapterStub();
    const sut = new UpdateUserUseCase(
      updateUserRepository,
      passwordHashAdapter,
      getUserByEmailRepository,
    );

    return {
      sut,
      updateUserRepository,
      passwordHashAdapter,
      getUserByEmailRepository,
    };
  };

  const baseHttpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 6,
      }),
    },
  } as Partial<Request> as Request;

  test('should update a user successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id, baseHttpRequest.body);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should update user (without password and email)', async () => {
    const { sut } = makeSut();

    const name = 'new name';

    const result = await sut.execute(user.id, {
      ...baseHttpRequest.body,
      name: name,
    });

    expect(result).toEqual(user);
  });

  test('should update user (with email)', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const getUserByEmailRepositorySpy = vi.spyOn(
      getUserByEmailRepository,
      'execute',
    );
    const email = 'new@gmail.com';

    const result = await sut.execute(user.id, {
      ...baseHttpRequest.body,
      email,
    });

    expect(getUserByEmailRepositorySpy).toHaveBeenCalledWith(email);
    expect(result).toBe(user);
  });

  test('should not check email if email is not provided', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    const getUserByEmailSpy = vi.spyOn(getUserByEmailRepository, 'execute');

    await sut.execute(faker.string.uuid(), {
      ...baseHttpRequest.body,
      email: undefined,
    });

    expect(getUserByEmailSpy).not.toHaveBeenCalled();
  });

  test('should update user (with password)', async () => {
    const { sut, passwordHashAdapter } = makeSut();
    const passwordHashAdapterSpy = vi.spyOn(passwordHashAdapter, 'execute');

    const password = '123456';

    const result = await sut.execute(user.id, {
      ...baseHttpRequest.body,
      password,
    });

    expect(passwordHashAdapterSpy).toHaveBeenCalledWith(password);
    expect(result).toBe(user);
  });

  test('should not check password if password is not provided', async () => {
    const { sut, passwordHashAdapter } = makeSut();
    const passwordHashAdapterSpy = vi.spyOn(passwordHashAdapter, 'execute');

    await sut.execute(faker.string.uuid(), {
      ...baseHttpRequest.body,
      password: undefined,
    });

    expect(passwordHashAdapterSpy).not.toHaveBeenCalled();
  });

  test('should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepository } = makeSut();
    vi.spyOn(updateUserRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user.id, baseHttpRequest.body);

    await expect(promise).rejects.toThrow();
  });

  test('should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
      new EmailAlreadyInUseError(user.email),
    );

    const promise = sut.execute(user.id, baseHttpRequest.body);

    await expect(promise).rejects.toThrow();
  });

  test('should throw EmailAlreadyInUseError if email is already in use', async () => {
    const { sut, getUserByEmailRepository } = makeSut();
    vi.spyOn(getUserByEmailRepository, 'execute').mockResolvedValueOnce({
      ...user,
      id: faker.string.uuid(),
    } as any);

    const promise = sut.execute(faker.string.uuid(), {
      ...baseHttpRequest.body,
      email: user.email,
    });

    await expect(promise).rejects.toThrow(
      new EmailAlreadyInUseError(user.email),
    );
  });

  test('should throw if PasswordHashAdapter throws', async () => {
    const { sut, passwordHashAdapter } = makeSut();
    vi.spyOn(passwordHashAdapter, 'execute').mockRejectedValueOnce(new Error());

    const promise = sut.execute(user.id, {
      ...baseHttpRequest.body,
      password: '123456',
    });

    await expect(promise).rejects.toThrow();
  });
});
