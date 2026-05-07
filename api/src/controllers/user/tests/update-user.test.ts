import { faker } from '@faker-js/faker';
import { user } from '../../../tests';
import { UpdateUserController } from '../update-user';
import type { Request } from 'express';
import { EmailAlreadyInUseError } from '../../../errors';

describe('Update User Controller', () => {
  class UpdateUserUseCaseStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const updateUserUseCaseStub = new UpdateUserUseCaseStub();
    const sut = new UpdateUserController(updateUserUseCaseStub);

    return { updateUserUseCaseStub, sut };
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

  test('should update a user', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(user);
  });

  test('should return 400 if user ID is invalid', async () => {
    const { sut } = makeSut();

    const userId = 'invalid_id';

    const request = {
      params: {
        userId,
      },
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 6,
        }),
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 400 if name is invalid', async () => {
    const { sut } = makeSut();

    const request = {
      params: {
        userId: faker.string.uuid(),
      },
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
      params: {
        userId: faker.string.uuid(),
      },
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
      params: {
        userId: faker.string.uuid(),
      },
      body: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: '123',
      },
    } as Partial<Request> as Request;

    const result = await sut.execute(request);

    expect(result.statusCode).toBe(400);
  });

  test('should return 500 if UpdateUserUseCase throws', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    vi.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(500);
  });

  test('should return 400 if EmailAlreadyInUseError throws', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    vi.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new EmailAlreadyInUseError(user.email),
    );

    const result = await sut.execute(baseHttpRequest);

    expect(result.statusCode).toBe(400);
  });
});
