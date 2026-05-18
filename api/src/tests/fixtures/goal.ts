import { faker } from '@faker-js/faker';
import { GoalsType } from '../../../generated/prisma/enums';

export const goal = {
  id: faker.string.uuid(),
  type: GoalsType.DAILY_PAGES,
  user_id: faker.string.uuid(),
  target_value: faker.number.int(),
  start_date: faker.date.anytime(),
  end_date: null,
  created_at: faker.date.anytime(),
  updated_at: faker.date.anytime(),
};
