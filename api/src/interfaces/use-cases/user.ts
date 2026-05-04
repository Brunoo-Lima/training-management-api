import type { IUpdateUser, IUser } from '../../@types/IUser';

export interface ICreateUserUseCase {
  execute(user: IUser): Promise<IUser>;
}

export interface IDeleteUserUseCase {
  execute(userId: string): Promise<IUser>;
}

export interface IGetUserByIdUseCase {
  execute(userId: string): Promise<IUser | null>;
}

export interface IUpdateUserUseCase {
  execute(userId: string, updateUserParams: IUpdateUser): Promise<IUpdateUser>;
}
