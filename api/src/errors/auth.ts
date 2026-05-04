export class InvalidPasswordError extends Error {
  constructor() {
    super(`Invalid password`);
    this.name = 'InvalidPasswordError';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super(`Unauthorized`);
    this.name = 'UnauthorizedError';
  }
}
