import { PasswordHashAdapter } from '../password-hash';
import { faker } from '@faker-js/faker';

describe('PasswordHashAdapter', () => {
  it('should return a hashed password', async () => {
    const sut = new PasswordHashAdapter();
    const password = faker.internet.password({
      length: 6,
    });

    const result = await sut.execute(password);

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).not.toBe(password);
  });
});
