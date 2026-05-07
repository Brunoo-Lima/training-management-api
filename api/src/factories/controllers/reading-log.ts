import {
  GetReadingLogController,
  GetReadingLogsByBookIdController,
  RegisterReadingLogController,
} from '../../controllers';
import {
  PostgresGetBookByIdRepository,
  PostgresGetReadingLogRepository,
  PostgresGetReadingLogsByBookIdRepository,
  PostgresGetUserByIdRepository,
  PostgresRegisterReadingLogRepository,
} from '../../repositories/postgres';
import {
  GetReadingLogsByBookIdUseCase,
  GetReadingLogUseCase,
  RegisterReadingLogUseCase,
} from '../../use-cases';

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

export const makeGetReadingLogController = () => {
  const getReadingLogRepository = new PostgresGetReadingLogRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getReadingLogUseCase = new GetReadingLogUseCase(
    getReadingLogRepository,
    getUserByIdRepository,
  );

  const getReadingLogController = new GetReadingLogController(
    getReadingLogUseCase,
  );

  return getReadingLogController;
};

export const makeGetReadingLogsByBookIdController = () => {
  const getReadingLogsByBookIdRepository =
    new PostgresGetReadingLogsByBookIdRepository();
  const getBookIdRepository = new PostgresGetBookByIdRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();

  const getReadingLogsByBookIdUseCase = new GetReadingLogsByBookIdUseCase(
    getReadingLogsByBookIdRepository,
    getBookIdRepository,
    getUserByIdRepository,
  );

  const getReadingLogsByBookIdController = new GetReadingLogsByBookIdController(
    getReadingLogsByBookIdUseCase,
  );

  return getReadingLogsByBookIdController;
};
