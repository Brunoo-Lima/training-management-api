import {
  GetReadingLogController,
  GetReadingLogsByBookIdController,
  RegisterReadingLogController,
} from '../../../controllers';
import {
  makeGetReadingLogController,
  makeGetReadingLogsByBookIdController,
  makeRegisterReadingLogController,
} from '../reading-log';

describe('Factory Reading Log Controller', () => {
  test('should return a RegisterReadingLogController', () => {
    const registerReadingLogController = makeRegisterReadingLogController();
    expect(registerReadingLogController).toBeInstanceOf(
      RegisterReadingLogController,
    );
  });

  test('should return a GetReadingLogController', () => {
    const getReadingLogController = makeGetReadingLogController();
    expect(getReadingLogController).toBeInstanceOf(GetReadingLogController);
  });

  test('should return a GetReadingLogsByBookIdController', () => {
    const getReadingLogsByBookIdController =
      makeGetReadingLogsByBookIdController();
    expect(getReadingLogsByBookIdController).toBeInstanceOf(
      GetReadingLogsByBookIdController,
    );
  });
});
