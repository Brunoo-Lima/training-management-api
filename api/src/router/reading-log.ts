import { Router, type IRouter, type Request, type Response } from 'express';
import { auth } from '../middlewares/auth';
import { makeRegisterReadingLogController } from '../factories/controllers/reading-log';

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

export { readingLogRoutes };
