import type { IBook } from '../../@types/IBook';

export interface ICreateBookUseCase {
  execute(book: IBook): Promise<IBook>;
}

export interface IGetBookByIdUseCase {
  execute(bookId: string, userId: string): Promise<IBook | null>;
}

export interface IGetMyBooksUseCase {
  execute(userId: string): Promise<IBook[]>;
}
