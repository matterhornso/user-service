import { IUpdateUser } from './UserInterface';
import EmailValidator from "email-validator";

export class UpdateUser implements IUpdateUser {
  email!: string;
  uuid!: string;
  fullName: string;

  constructor(user: IUpdateUser) {
    if (!user.uuid) throw new Error('uuid not defined');

    if (!user.fullName) throw new Error('Name not defined');
    if (!user.email) throw new Error('Email not defined');
    if (!EmailValidator.validate(user.email)) throw new Error('Email not valid');
    if (!user.fullName) throw new Error('password not defined');

    this.email = user.email;
    this.uuid = user.uuid;
    this.fullName = user.fullName
  }
}