import type { StatusReading } from '../../generated/prisma/enums';

export interface IBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  genre: string[];
  status: StatusReading;
  total_pages: number;
  start_date?: Date | null;
  end_date?: Date | null;
  created_at: Date;
  updated_at?: Date;
}

export type IUpdateBook = Partial<IBook> &
  Omit<IBook, 'id' | 'user_id' | 'created_at'>;
