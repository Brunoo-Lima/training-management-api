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
