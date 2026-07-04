import { IUser } from './UserInterface';
import EmailValidator from "email-validator";
import { v4 as generateUUID } from 'uuid';
import CryptoJS from 'crypto-js';
export class CreateUser implements IUser {
  uuid?: string;
  fullName!: string;
  email!: string;
  departmentId!: string;
  password!: string;
  shineKey: string;
  shineName: string;
  department_shine_name?: string;
  user_shine_name: string;
  user_encrypted_data: string;
  user_public_key: string;
  user_signature: string;
  shinePrivateKey: string

  constructor(user: IUser) {
    if (!user.fullName) throw new Error('FullName missing! createUser Entity.');
    if (!user.email) throw new Error('Email missing! createUser Entity.');
    if (!user.departmentId) throw new Error('departmentId missing! createUser Entity.');
    if (!user.password) throw new Error('password missing! createUser Entity.');
    if (!user.shineKey) throw new Error('shineKey missing! createUser Entity.');
    if (!user.shineName) throw new Error('shineName missing! createUser Entity.');
    if (!user.shinePrivateKey) throw new Error('shinePrivateKey missing! createUser Entity.');
    if (!EmailValidator.validate(user.email)) throw new Error('Email not valid');

    this.uuid = generateUUID();
    this.fullName = user.fullName;
    this.email = user.email;
    this.departmentId = user.departmentId;
    //this.password = CryptoJS.MD5(user.password).toString()
    this.password = user.password;
    this.shineKey = user.shineKey;
    this.shineName = user.shineName;
    // this.department_shine_name = user.department_shine_name;
    this.user_shine_name = user.user_shine_name;
    this.user_encrypted_data = user.user_encrypted_data;
    this.shinePrivateKey = user.shinePrivateKey;
    this.user_public_key = user.user_public_key;
    this.user_signature = user.user_signature;
  }
}