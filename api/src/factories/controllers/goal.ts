import { IdGeneratorAdapter } from '../../adapters';
import { CreateGoalController } from '../../controllers';
import {
  PostgresCreateGoalRepository,
  PostgresGetUserByIdRepository,
} from '../../repositories/postgres';
import { CreateGoalUseCase } from '../../use-cases';

export const makeCreateGoalController = () => {
  const createGoalRepository = new PostgresCreateGoalRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const idGeneratorAdapter = new IdGeneratorAdapter();

  const createGoalUseCase = new CreateGoalUseCase(
    createGoalRepository,
    getUserByIdRepository,
    idGeneratorAdapter,
  );

  const createGoalController = new CreateGoalController(createGoalUseCase);

  return createGoalController;
};
