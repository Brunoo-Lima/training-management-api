import type { IBook } from '../../@types/IBook';

export interface ICreateBookRepository {
  execute(book: IBook): Promise<IBook>;
}

export interface IGetBookByTitleRepository {
  execute(title: string): Promise<IBook | null>;
}
