import {
  CreateBookController,
  DeleteBookController,
  GetBookByIdController,
  GetMyBooksController,
  UpdateBookController,
} from '../../controllers';
import {
  PostgresCreateBookRepository,
  PostgresDeleteBookRepository,
  PostgresGetBookByIdRepository,
  PostgresGetBookByTitleRepository,
  PostgresGetMyBooksRepository,
  PostgresGetUserByIdRepository,
  PostgresUpdateBookRepository,
} from '../../repositories/postgres';
import {
  CreateBookUseCase,
  DeleteBookUseCase,
  GetBookByIdUseCase,
  GetMyBooksUseCase,
  UpdateBookUseCase,
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

export const makeUpdateBookController = () => {
  const updateBookRepository = new PostgresUpdateBookRepository();
  const getBookByIdRepository = new PostgresGetBookByIdRepository();
  const getBookByTitleRepository = new PostgresGetBookByTitleRepository();
  const updateBookUseCase = new UpdateBookUseCase(
    updateBookRepository,
    getBookByIdRepository,
    getBookByTitleRepository,
  );

  const updateBookController = new UpdateBookController(updateBookUseCase);

  return updateBookController;
};
