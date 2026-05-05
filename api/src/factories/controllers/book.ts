import {
  CreateBookController,
  DeleteBookController,
  GetBookByIdController,
  GetMyBooksController,
} from '../../controllers';
import {
  PostgresCreateBookRepository,
  PostgresDeleteBookRepository,
  PostgresGetBookByIdRepository,
  PostgresGetBookByTitleRepository,
  PostgresGetMyBooksRepository,
  PostgresGetUserByIdRepository,
} from '../../repositories/postgres';
import {
  CreateBookUseCase,
  DeleteBookUseCase,
  GetBookByIdUseCase,
  GetMyBooksUseCase,
} from '../../use-cases';

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

export const makeGetMyBooksController = () => {
  const getMyBooksRepository = new PostgresGetMyBooksRepository();
  const getUserByIdRepository = new PostgresGetUserByIdRepository();
  const getMyBooksUseCase = new GetMyBooksUseCase(
    getMyBooksRepository,
    getUserByIdRepository,
  );

  const getMyBooksController = new GetMyBooksController(getMyBooksUseCase);

  return getMyBooksController;
};

export const makeDeleteBookController = () => {
  const deleteBookRepository = new PostgresDeleteBookRepository();
  const getBookByIdRepository = new PostgresGetBookByIdRepository();
  const deleteBookUseCase = new DeleteBookUseCase(
    deleteBookRepository,
    getBookByIdRepository,
  );

  const deleteBookController = new DeleteBookController(deleteBookUseCase);

  return deleteBookController;
};
