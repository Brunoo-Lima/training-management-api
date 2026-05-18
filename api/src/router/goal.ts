import { Router, type IRouter, type Request, type Response } from 'express';
import { makeCreateBookController } from '../factories/controllers';

const goalRoutes: IRouter = Router();

goalRoutes.post('/', async (request: Request, response: Response) => {
  const createGoalController = makeCreateBookController();

  request.body.user_id = request.userId as string;

  const { statusCode, body } = await createGoalController.execute(request);

  return response.status(statusCode).send(body);
});

export { goalRoutes };
