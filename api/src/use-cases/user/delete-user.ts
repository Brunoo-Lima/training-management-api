import type { IDeleteUserRepository } from '../../interfaces/repositories';

export class DeleteUserUseCase {
  private deleteUserRepository: IDeleteUserRepository;
  constructor(deleteUserRepository: IDeleteUserRepository) {
    this.deleteUserRepository = deleteUserRepository;
  }

  async execute(userId: string) {
    return await this.deleteUserRepository.execute(userId);
  }
}
