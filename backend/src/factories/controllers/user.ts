import { IdGeneratorAdapter, PasswordHashAdapter } from '../../adapters';
import { CreateUserController } from '../../controllers';
import { PostgresCreateUserRepository } from '../../repositories/postgres';
import { CreateUserUseCase } from '../../use-cases';

export const makeCreateUseController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const passwordHashAdapter = new PasswordHashAdapter();
  const idGeneratorAdapter = new IdGeneratorAdapter();
  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    idGeneratorAdapter,
    passwordHashAdapter,
  );

  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};
