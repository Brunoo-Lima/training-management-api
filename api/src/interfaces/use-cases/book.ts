import type { StatusReading } from '../../../generated/prisma/enums';
import type { IBook, IUpdateBook } from '../../@types/IBook';

export interface ICreateBookUseCase {
  execute(book: IBook): Promise<IBook>;
}

export interface IGetBookByIdUseCase {
  execute(bookId: string, userId: string): Promise<IBook | null>;
}

export interface IGetMyBooksUseCase {
  execute(
    userId: string,
    title?: string,
    genre?: string,
    status?: StatusReading,
  ): Promise<IBook[]>;
}

export interface IDeleteBookUseCase {
  execute(bookId: string, userId: string): Promise<IBook | null>;
}

export interface IUpdateBookUseCase {
  execute(
    bookId: string,
    userId: string,
    book: IUpdateBook,
  ): Promise<IBook | null>;
}
