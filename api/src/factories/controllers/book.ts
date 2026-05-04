import { CreateBookController, GetBookByIdController } from '../../controllers';
import {
  PostgresCreateBookRepository,
  PostgresGetBookByIdRepository,
  PostgresGetBookByTitleRepository,
} from '../../repositories/postgres';
import { CreateBookUseCase, GetBookByIdUseCase } from '../../use-cases';

export const makeCreateBookController = () => {
  const createBookRepository = new PostgresCreateBookRepository();
  const getBookByTitleRepository = new PostgresGetBookByTitleRepository();
  const createBookUseCase = new CreateBookUseCase(
    createBookRepository,
    getBookByTitleRepository,
  );

  const createBookController = new CreateBookController(createBookUseCase);

  return createBookController;
};

export const makeGetBookByIdController = () => {
  const getBookByIdRepository = new PostgresGetBookByIdRepository();
  const getBookByIdUseCase = new GetBookByIdUseCase(getBookByIdRepository);

  const getBookByIdController = new GetBookByIdController(getBookByIdUseCase);

  return getBookByIdController;
};
