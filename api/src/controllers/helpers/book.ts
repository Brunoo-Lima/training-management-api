import { notFound } from './http';

export const bookNotFoundResponse = () =>
  notFound({
    message: `Book not found`,
  });
