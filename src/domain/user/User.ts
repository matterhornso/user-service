import { ChangePassword, CreateUser, UpdateUser } from '../index';
import { IUser, IChangePassword, IUpdateUser } from './UserInterface';

export class User {

  constructor() { };

  create(user: IUser, usecase: any) {
    let createUser = new CreateUser(user);
    return usecase.execute(createUser)
  }

  changePassword(user: IChangePassword, usecase: any) {
    let changePassword = new ChangePassword(user);
    return usecase.execute(changePassword)
  }

  updateUserInfo(user: IUpdateUser, usecase: any) {
    let updateUser = new UpdateUser(user);
    return usecase.execute(updateUser)
  }
}