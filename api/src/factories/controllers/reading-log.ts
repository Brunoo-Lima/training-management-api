import { RegisterReadingLogController } from '../../controllers';
import {
  PostgresGetBookByIdRepository,
  PostgresGetUserByIdRepository,
  PostgresRegisterReadingLogRepository,
} from '../../repositories/postgres';
import { RegisterReadingLogUseCase } from '../../use-cases';

export const makeRegisterReadingLogController = () => {
  const registerReadingLogRepository =
    new PostgresRegisterReadingLogRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getBookByIdRepository = new PostgresGetBookByIdRepository();

  const registerReadingLogUseCase = new RegisterReadingLogUseCase(
    registerReadingLogRepository,
    getUserByIdRepository,
    getBookByIdRepository,
  );

  const registerReadingLogController = new RegisterReadingLogController(
    registerReadingLogUseCase,
  );

  return registerReadingLogController;
};
