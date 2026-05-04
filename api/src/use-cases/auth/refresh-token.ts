import type { IDecodedToken } from '../../@types/IAuth';
import { UnauthorizedError } from '../../errors';
import type {
  ITokensGeneratorAdapter,
  ITokenVerifierAdapter,
} from '../../interfaces/adapters';

export class RefreshTokenUseCase {
  private tokensGeneratorAdapter: ITokensGeneratorAdapter;
  private tokenVerifierAdapter: ITokenVerifierAdapter;

  constructor(
    tokensGeneratorAdapter: ITokensGeneratorAdapter,
    tokenVerifierAdapter: ITokenVerifierAdapter,
  ) {
    this.tokensGeneratorAdapter = tokensGeneratorAdapter;
    this.tokenVerifierAdapter = tokenVerifierAdapter;
  }
  async execute(refreshToken: string) {
    const decodedToken = this.tokenVerifierAdapter.execute(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
    ) as IDecodedToken;

    if (!decodedToken) {
      throw new UnauthorizedError();
    }

    const tokens = this.tokensGeneratorAdapter.execute(decodedToken.userId);

    return tokens;
  }
}
