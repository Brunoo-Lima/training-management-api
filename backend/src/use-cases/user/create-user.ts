import type { IUser } from '../../@types/IUser';

import type { ICreateUserRepository } from '../../interfaces/repositories/user';
import type {
  IPasswordHashAdapter,
  IIdGeneratorAdapter,
} from '../../interfaces/adapters';

export class CreateUserUseCase {
  private createUserRepository: ICreateUserRepository;
  private idGeneratorAdapter: IIdGeneratorAdapter;
  private passwordHashAdapter: IPasswordHashAdapter;

  constructor(
    createUserRepository: ICreateUserRepository,
    idGeneratorAdapter: IIdGeneratorAdapter,
    passwordHashAdapter: IPasswordHashAdapter,
  ) {
    this.createUserRepository = createUserRepository;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.passwordHashAdapter = passwordHashAdapter;
  }

  async execute(user: IUser) {
    const userId = await this.idGeneratorAdapter.execute();

    const hashedPassword = await this.passwordHashAdapter.execute(
      user.password,
    );

    const createUser = await this.createUserRepository.execute({
      ...user,
      password: hashedPassword,
      id: userId,
    });

    return createUser;
  }
}
