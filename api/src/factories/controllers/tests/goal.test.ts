import { CreateGoalController } from '../../../controllers';
import { makeCreateGoalController } from '../goal';

describe('Factory Goal Controller', () => {
  test('should return a CreateGoalController', () => {
    const createGoalController = makeCreateGoalController();
    expect(createGoalController).toBeInstanceOf(CreateGoalController);
  });
});
