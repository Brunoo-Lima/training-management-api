import type { Request } from 'express';
import type { ICreateBookUseCase } from '../../interfaces/use-cases';
import { badRequest, created, serverError } from '../helpers';
import { createBookSchema } from '../../schemas';
import { ZodError } from 'zod';
import { BookAlreadyExistsError, InvalidBookDatesError } from '../../errors';

export class CreateBookController {
  private createBookUseCase: ICreateBookUseCase;
  constructor(createBookUseCase: ICreateBookUseCase) {
    this.createBookUseCase = createBookUseCase;
  }
  async execute(req: Request) {
    try {
      const params = req.body;

      await createBookSchema.parseAsync(params);

      const book = await this.createBookUseCase.execute(params);

      return created(book);
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({ message: error.issues[0]?.message });
      }

      if (error instanceof BookAlreadyExistsError) {
        return badRequest({ message: error.message });
      }

      if (error instanceof InvalidBookDatesError) {
        return badRequest({ message: error.message });
      }

      console.error(error);
      return serverError();
    }
  }
}
