export interface IReadingLog {
  id: string;
  book_id: string;
  user_id: string;
  pages_read: number;
  notes_about_session?: string;

  created_at: Date;
  updated_at?: Date;
}
