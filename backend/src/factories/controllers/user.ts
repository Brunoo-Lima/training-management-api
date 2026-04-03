import { CreateUserController } from '../../controllers';
import { PostgresCreateUserRepository } from '../../repositories/postgres';
import { CreateUserUseCase } from '../../use-cases';

export const makeCreateUseController = () => {
  const createUserRepository = new PostgresCreateUserRepository();
  const createUserUseCase = new CreateUserUseCase(createUserRepository);

  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
};
