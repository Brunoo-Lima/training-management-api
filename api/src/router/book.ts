import { Router, type IRouter, type Request, type Response } from 'express';
import {
  makeCreateBookController,
  makeGetBookByIdController,
} from '../factories/controllers';
import { auth } from '../middlewares/auth';

const bookRoutes: IRouter = Router();

bookRoutes.post('/', auth, async (request: Request, response: Response) => {
  const createBookController = makeCreateBookController();

  request.body.user_id = request.userId;

  const { statusCode, body } = await createBookController.execute(request);

  return response.status(statusCode).json(body);
});

bookRoutes.get('/:id', auth, async (request: Request, response: Response) => {
  const getBookByIdController = makeGetBookByIdController();

  const { statusCode, body } = await getBookByIdController.execute(request);

  return response.status(statusCode).json(body);
});

export { bookRoutes };
