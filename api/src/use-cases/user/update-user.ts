import type { IUpdateUser } from '../../@types/IUser';
import { EmailAlreadyInUseError } from '../../errors';
import type { IPasswordHashAdapter } from '../../interfaces/adapters';
import type {
  IGetUserByEmailRepository,
  IUpdateUserRepository,
} from '../../interfaces/repositories';

export class UpdateUserUseCase {
  private updateUserRepository: IUpdateUserRepository;
  private passwordHashAdapter: IPasswordHashAdapter;
  private getUserByEmailRepository: IGetUserByEmailRepository;

  constructor(
    updateUserRepository: IUpdateUserRepository,
    passwordHashAdapter: IPasswordHashAdapter,
    getUserByEmailRepository: IGetUserByEmailRepository,
  ) {
    this.updateUserRepository = updateUserRepository;
    this.passwordHashAdapter = passwordHashAdapter;
    this.getUserByEmailRepository = getUserByEmailRepository;
  }

  async execute(userId: string, updateUserParams: IUpdateUser) {
    if (updateUserParams.email) {
      const emailAlreadyExists = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      );

      if (emailAlreadyExists && emailAlreadyExists.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email);
      }
    }

    const user = { ...updateUserParams };

    if (updateUserParams.password) {
      const hashedPassword = await this.passwordHashAdapter.execute(
        updateUserParams.password,
      );

      user.password = hashedPassword;
    }

    const updateUser = await this.updateUserRepository.execute(userId, user);

    return updateUser;
  }
}
