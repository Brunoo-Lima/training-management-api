import { badRequest } from './http';
import validator from 'validator';

export const invalidIdResponse = () =>
  badRequest({
    message: 'Invalid id',
  });

export const checkIfIdIsValid = (id: string) => validator.isUUID(id);
