import {
  CreateBookController,
  DeleteBookController,
  GetBookByIdController,
  GetMyBooksController,
  UpdateBookController,
} from '../../../controllers';
import {
  makeCreateBookController,
  makeDeleteBookController,
  makeGetBookByIdController,
  makeGetMyBooksController,
  makeUpdateBookController,
} from '../book';

describe('Factory Book Controller', () => {
  test('should return a BookController', () => {
    const createBookController = makeCreateBookController();
    expect(createBookController).toBeInstanceOf(CreateBookController);
  });

  test('should return a GetBookByIdController', () => {
    const getBookByIdController = makeGetBookByIdController();
    expect(getBookByIdController).toBeInstanceOf(GetBookByIdController);
  });

  test('should return a GetMyBooksController', () => {
    const getMyBooksController = makeGetMyBooksController();
    expect(getMyBooksController).toBeInstanceOf(GetMyBooksController);
  });

  test('should return a DeleteBookController', () => {
    const deleteBookController = makeDeleteBookController();
    expect(deleteBookController).toBeInstanceOf(DeleteBookController);
  });

  test('should return a UpdateBookController', () => {
    const updateBookController = makeUpdateBookController();
    expect(updateBookController).toBeInstanceOf(UpdateBookController);
  });
});
