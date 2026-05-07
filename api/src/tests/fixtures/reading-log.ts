import { faker } from '@faker-js/faker';

export const readingLog = {
  id: faker.string.uuid(),
  book_id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  pages_read: faker.number.int(),
  notes_about_session: faker.lorem.sentence(),
  date: faker.date.anytime(),
  created_at: faker.date.anytime(),
  updated_at: faker.date.anytime(),
};
