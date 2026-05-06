import { faker } from '@faker-js/faker';

export const user = {
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  created_at: faker.date.anytime(),
  updated_at: faker.date.anytime(),
};
