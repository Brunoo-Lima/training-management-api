import {
  PasswordComparatorAdapter,
  TokensGeneratorAdapter,
} from '../../adapters';
import { LoginController } from '../../controllers';
import { PostgresGetUserByEmailRepository } from '../../repositories/postgres';
import { LoginUseCase } from '../../use-cases';

export const makeLoginController = () => {
  const getUserByEmailRepository = new PostgresGetUserByEmailRepository();
  const passwordComparatorAdapter = new PasswordComparatorAdapter();
  const tokensGeneratorAdapter = new TokensGeneratorAdapter();

  const loginUseCase = new LoginUseCase(
    getUserByEmailRepository,
    passwordComparatorAdapter,
    tokensGeneratorAdapter,
  );

  const loginController = new LoginController(loginUseCase);

  return loginController;
};
