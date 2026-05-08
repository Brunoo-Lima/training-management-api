import { LoginController, RefreshTokenController } from '../../../controllers';
import { makeLoginController, makeRefreshTokenController } from '../auth';

describe('Factory Auth Controller', () => {
  test('should return a LoginController', () => {
    const loginController = makeLoginController();
    expect(loginController).toBeInstanceOf(LoginController);
  });

  test('should return a RefreshTokenController', () => {
    const refreshTokenController = makeRefreshTokenController();
    expect(refreshTokenController).toBeInstanceOf(RefreshTokenController);
  });
});
