import { IChangePassword } from './UserInterface';
import EmailValidator from "email-validator";

export class ChangePassword implements IChangePassword {
  email!: string;
  uuid!: string;
  oldPassword!: string;
  newPassword!: string;

  constructor(user: IChangePassword) {
    if (!user.uuid) throw new Error('uuid not defined');
    if (!user.email) throw new Error('Email not defined');
    if (!EmailValidator.validate(user.email)) throw new Error('Email not valid');
    if (!user.oldPassword) throw new Error('password not defined');
    if (!user.newPassword) throw new Error('password not defined');

    this.email = user.email;
    this.uuid = user.uuid;
    this.oldPassword = user.oldPassword;
    this.newPassword = user.newPassword;
  }
}