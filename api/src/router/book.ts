import { Router, type IRouter, type Request, type Response } from 'express';
import {
  makeCreateBookController,
  makeDeleteBookController,
  makeGetBookByIdController,
  makeGetMyBooksController,
  makeUpdateBookController,
} from '../factories/controllers';
import { auth } from '../middlewares/auth';

const bookRoutes: IRouter = Router();

bookRoutes.post('/', auth, async (request: Request, response: Response) => {
  const createBookController = makeCreateBookController();

  request.body.user_id = request.userId;

  const { statusCode, body } = await createBookController.execute(request);

  return response.status(statusCode).send(body);
});

bookRoutes.get('/:id', auth, async (request: Request, response: Response) => {
  const getBookByIdController = makeGetBookByIdController();

  request.params.userId = request.userId as string;

  const { statusCode, body } = await getBookByIdController.execute(request);

  return response.status(statusCode).send(body);
});

bookRoutes.get('/', auth, async (request: Request, response: Response) => {
  const getMyBooksController = makeGetMyBooksController();

  request.params.userId = request.userId as string;

  const { statusCode, body } = await getMyBooksController.execute(request);

  return response.status(statusCode).send(body);
});

bookRoutes.delete(
  '/:id',
  auth,
  async (request: Request, response: Response) => {
    const deleteBookController = makeDeleteBookController();

    request.params.userId = request.userId as string;

    const { statusCode, body } = await deleteBookController.execute(request);

    return response.status(statusCode).send(body);
  },
);

bookRoutes.patch('/:id', auth, async (request: Request, response: Response) => {
  const updateBookController = makeUpdateBookController();

  request.params.userId = request.userId as string;

  const { statusCode, body } = await updateBookController.execute(request);

  return response.status(statusCode).send(body);
});

export { bookRoutes };
