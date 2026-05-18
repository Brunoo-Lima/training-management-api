import bcrypt from 'bcryptjs';
import { PasswordComparatorAdapter } from '../password-comparator';

vi.mock('bcryptjs');

describe('PasswordComparatorAdapter', () => {
  let sut: PasswordComparatorAdapter;

  beforeEach(() => {
    sut = new PasswordComparatorAdapter();
  });

  it('should return true when passwords match', async () => {
    vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

    const result = await sut.execute('any_password', 'any_hashed_password');

    expect(result).toBe(true);
  });
});
