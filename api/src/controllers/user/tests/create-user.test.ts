import type { Request } from 'express';
import { user } from '../../../tests';
import { CreateUserController } from '../create-user';
import { faker } from '@faker-js/faker';
import { EmailAlreadyInUseError } from '../../../errors';

describe('Create User Controller', () => {
  class CreateUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub();
    const sut = new CreateUserController(createUserUseCaseStub);

    return { createUserUseCaseStub, sut };
  };

  const baseHttpRequest = {
    body: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 6,
      }),
    },
  } as Partial<Request> as Request;

  test('should create a new user', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual(user);
  });

  test('should return 400 if name is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: '',
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 6,
        }),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if email is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: faker.person.fullName(),
        email: 'invalid_email',
        password: faker.internet.password({
          length: 6,
        }),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if password is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: '123',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 500 if CreateUserUseCase throws', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    vi.spyOn(createUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 400 if EmailAlreadyInUseError throws', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    vi.spyOn(createUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new EmailAlreadyInUseError(user.email),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });
});
