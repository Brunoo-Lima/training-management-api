import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from '../../../controllers';
import {
  makeCreateUseController,
  makeDeleteUserController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from '../user';

describe('Factory User Controller', () => {
  test('should return a CreateUserController', () => {
    const createUserController = makeCreateUseController();
    expect(createUserController).toBeInstanceOf(CreateUserController);
  });

  test('should return a DeleteUserController', () => {
    const deleteUserController = makeDeleteUserController();
    expect(deleteUserController).toBeInstanceOf(DeleteUserController);
  });

  test('should return a GetUserByIdController', () => {
    const getUserByIdController = makeGetUserByIdController();
    expect(getUserByIdController).toBeInstanceOf(GetUserByIdController);
  });

  test('should return a UpdateUserController', () => {
    const updateUserController = makeUpdateUserController();
    expect(updateUserController).toBeInstanceOf(UpdateUserController);
  });
});
