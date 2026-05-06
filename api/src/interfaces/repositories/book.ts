import type { StatusReading } from '../../../generated/prisma/enums';
import type { IBook, IUpdateBook } from '../../@types/IBook';

export interface ICreateBookRepository {
  execute(book: IBook): Promise<IBook>;
}

export interface IGetBookByTitleRepository {
  execute(title: string): Promise<IBook | null>;
}

export interface IGetBookByIdRepository {
  execute(bookId: string): Promise<IBook | null>;
}

export interface IGetMyBooksRepository {
  execute(
    userId: string,
    title?: string,
    genre?: string,
    status?: StatusReading,
  ): Promise<IBook[]>;
}

export interface IDeleteBookRepository {
  execute(bookId: string): Promise<IBook | null>;
}

export interface IUpdateBookRepository {
  execute(bookId: string, book: IUpdateBook): Promise<IBook | null>;
}
