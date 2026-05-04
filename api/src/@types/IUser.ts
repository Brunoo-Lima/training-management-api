export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export type IUserSafe = Omit<IUser, 'password'>;

export type IUpdateUser = Omit<IUser, 'id' | 'created_at'>;
