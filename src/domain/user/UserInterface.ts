export interface IUser {
  uuid?: string;
  fullName: string;
  email: string;
  departmentId: string;
  password: string;
  shineKey: string;
  shinePrivateKey:string
  passwordHash?: string;
  passwordSalt?: string;
  shineName?: string;
  department_shine_name?: string;
  user_shine_name: string;
  user_encrypted_data: string;
  user_public_key: string;
  user_signature: string;
  transactionId?: string;
  transactionStatus?: boolean;

}

export interface IChangePassword {
  email: string;
  uuid: string;
  oldPassword: string;
  newPassword: string
}

export interface IUpdateUser {
  email: string;
  uuid: string;
  fullName: string;
}