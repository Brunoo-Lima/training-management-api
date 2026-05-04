import type { IUpdateUser, IUser } from '../../@types/IUser';

export interface ICreateUserRepository {
  execute(user: IUser): Promise<IUser>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<IUser | null>;
}

export interface IDeleteUserRepository {
  execute(userId: string): Promise<IUser>;
}

export interface IGetUserByIdRepository {
  execute(userId: string): Promise<IUser | null>;
}

export interface IUpdateUserRepository {
  execute(userId: string, updateUserParams: IUpdateUser): Promise<IUpdateUser>;
}
