export class BookAlreadyExistsError extends Error {
  constructor(message?: string) {
    super(message || 'Book already exists');
    this.name = 'BookAlreadyExistsError';
  }
}

export class InvalidBookDatesError extends Error {
  constructor() {
    super('End date cannot be before start date');
    this.name = 'InvalidBookDatesError';
  }
}

export class BookNotFoundError extends Error {
  constructor(bookId?: string) {
    super(`Book with id ${bookId ?? 'unknown'} not found`);
    this.name = 'BookNotFoundError';
  }
}

export class InvalidBookStatusError extends Error {
  constructor(status?: string) {
    super(`Invalid book status: ${status ?? 'unknown'}`);
    this.name = 'InvalidBookStatusError';
  }
}

export class InvalidBookGenreError extends Error {
  constructor(genre?: string) {
    super(`Invalid book genre: ${genre ?? 'unknown'}`);
    this.name = 'InvalidBookGenreError';
  }
}

export class InvalidBookTitleError extends Error {
  constructor(message?: string) {
    super(message || 'Invalid book title');
    this.name = 'InvalidBookTitleError';
  }
}

export class BookGenreNotFoundError extends Error {
  constructor(genre?: string) {
    super(`Book genre not found: ${genre ?? 'unknown'}`);
    this.name = 'BookGenreNotFoundError';
  }
}
