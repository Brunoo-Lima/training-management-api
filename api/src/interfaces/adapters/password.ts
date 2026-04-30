export interface IPasswordHashAdapter {
  execute(password: string): Promise<string>;
}

export interface IPasswordComparatorAdapter {
  execute(password: string, hashedPassword: string): Promise<boolean>;
}
