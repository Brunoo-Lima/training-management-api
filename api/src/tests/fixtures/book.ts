import { faker } from '@faker-js/faker';
import { StatusReading } from '../../../generated/prisma/enums';

export const book = {
  id: faker.string.uuid(),
  title: faker.book.title(),
  author: faker.person.fullName(),
  genre: ['Fiction', 'Mystery', 'Thriller'],
  status: StatusReading.WISHLIST,
  total_pages: faker.number.int(),
  start_date: faker.date.anytime(),
  end_date: null,
  created_at: faker.date.anytime(),
  updated_at: faker.date.anytime(),
  user_id: faker.string.uuid(),
};
