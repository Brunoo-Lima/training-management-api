export class BookAlreadyExistsError extends Error {
  constructor() {
    super('Book already exists');
    this.name = 'BookAlreadyExistsError';
  }
}

export class InvalidBookDatesError extends Error {
  constructor() {
    super('End date cannot be before start date');
    this.name = 'InvalidBookDatesError';
  }
}
