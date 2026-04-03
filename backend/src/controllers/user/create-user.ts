import type { Request, Response } from 'express';
import type { IUser } from '../../@types/IUser';

interface ICreateUserUseCase {
  execute(user: IUser): Promise<IUser>;
}

export class CreateUserController {
  private createUserUseCase: ICreateUserUseCase;
  constructor(createUserUseCase: ICreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  async execute(res: Response, req: Request) {
    try {
      const user = req.body;

      const createdUser = await this.createUserUseCase.execute(user);

      return res.status(201).json(createdUser);
    } catch (error) {
      console.error(error);
    }
  }
}
