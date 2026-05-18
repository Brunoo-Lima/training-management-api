import { Router, type IRouter, type Request, type Response } from 'express';
import { auth } from '../middlewares/auth';
import {
  makeGetReadingLogController,
  makeGetReadingLogsByBookIdController,
  makeRegisterReadingLogController,
} from '../factories/controllers';

const readingLogRoutes: IRouter = Router();

readingLogRoutes.post(
  '/',
  auth,
  async (request: Request, response: Response) => {
    const registerReadingLogController = makeRegisterReadingLogController();

    request.params.userId = request.userId as string;

    const { statusCode, body } =
      await registerReadingLogController.execute(request);

    return response.status(statusCode).send(body);
  },
);

readingLogRoutes.get(
  '/',
  auth,
  async (request: Request, response: Response) => {
    const registerReadingLogController = makeGetReadingLogController();

    request.params.userId = request.userId as string;

    const { statusCode, body } =
      await registerReadingLogController.execute(request);

    return response.status(statusCode).send(body);
  },
);

readingLogRoutes.get(
  '/book/',
  auth,
  async (request: Request, response: Response) => {
    const registerReadingLogsByBookIdController =
      makeGetReadingLogsByBookIdController();

    request.params.userId = request.userId as string;

    const { statusCode, body } =
      await registerReadingLogsByBookIdController.execute(request);

    return response.status(statusCode).send(body);
  },
);

export { readingLogRoutes };
