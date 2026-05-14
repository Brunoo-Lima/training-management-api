import { user } from '../../../tests';
import { DeleteUserUseCase } from '../delete-user';

describe('Delete User Use Case', () => {
  class DeleteUserRepositoryStub {
    async execute() {
      return user;
    }
  }

  const makeSut = () => {
    const deleteUserRepository = new DeleteUserRepositoryStub();
    const sut = new DeleteUserUseCase(deleteUserRepository);

    return { sut, deleteUserRepository };
  };

  test('should delete a user successfully', async () => {
    const { sut } = makeSut();

    const result = await sut.execute(user.id);

    expect(result).toBeTruthy();
    expect(result).toBeDefined();
  });

  test('should throw if DeleteUserRepository throws', async () => {
    const { sut, deleteUserRepository } = makeSut();
    vi.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
      new Error(),
    );

    const promise = sut.execute(user.id);

    await expect(promise).rejects.toThrow();
  });
});
